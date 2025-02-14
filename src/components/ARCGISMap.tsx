import React, { useEffect, useRef, useState } from "react";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
import Extent from "@arcgis/core/geometry/Extent";
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import esriConfig from "@arcgis/core/config";
import useLocation from "../hooks/useLocation";
import { supabase } from "../services/supabaseClient";

import paperPlaneIcon from "../assets/paper-plane.svg";
import pinkPaperPlaneIcon from "../assets/paper-plane-pink.svg";

import MessageModal from "./LettersModal";

const ArcGISMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<MapView | null>(null);
  const { location, error } = useLocation();

  const [modalMessages, setModalMessages] = useState<
    { createdAt: string; letterContent: string }[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);

  const initialCenter = location
    ? new Point({ longitude: location.lng, latitude: location.lat })
    : new Point({ longitude: 0, latitude: 0 });

  const addMarker = (row: any, view: MapView) => {
    const latitude =
      typeof row.recipient_lat === "number"
        ? row.recipient_lat
        : parseFloat(row.recipient_lat);
    const longitude =
      typeof row.recipient_lng === "number"
        ? row.recipient_lng
        : parseFloat(row.recipient_lng);
    const point = new Point({ longitude, latitude });

    const defaultSymbol = new PictureMarkerSymbol({
      url: paperPlaneIcon,
      width: "24px",
      height: "24px",
    });
    const hoverSymbol = new PictureMarkerSymbol({
      url: pinkPaperPlaneIcon,
      width: "24px",
      height: "24px",
    });

    const graphic = new Graphic({
      geometry: point,
      symbol: defaultSymbol,
    });

    graphic.attributes = {
      letterContent: row.letter_content,
      markerType: "paperPlane",
      sender_lat: row.sender_lat,
      sender_lng: row.sender_lng,
      created_at: row.created_at,
    };

    (graphic as any).defaultSymbol = defaultSymbol;
    (graphic as any).hoverSymbol = hoverSymbol;

    view.graphics.add(graphic);
  };

  useEffect(() => {
    if (!mapRef.current) return;
    
    esriConfig.apiKey = import.meta.env.VITE_ARCGIS_API_KEY;

    const modernAntiqueMap = new VectorTileLayer({
      url: "https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/layers/arcgis/modern-antique",
    });

    const map = new Map({
      layers: [modernAntiqueMap],
    });

    const limitExtent = new Extent({
      xmin: -7200,
      ymin: -70,
      xmax: 7200,
      ymax: 70,
      spatialReference: { wkid: 4326 },
    });

    const view = new MapView({
      container: mapRef.current,
      map: map,
      center: initialCenter,
      zoom: 8,
      constraints: {
        minZoom: 2,
        snapToZoom: false,
        rotationEnabled: false,
        geometry: limitExtent,
      },
    });

    view.ui.remove("zoom");
    viewRef.current = view;

    const lineGraphicRef = { current: null as Graphic | null };

    (async () => {
      const { data, error: fetchError } = await supabase
        .from("messages")
        .select(
          "recipient_lat, recipient_lng, letter_content, sender_lat, sender_lng, created_at"
        );
      if (fetchError) {
        console.error("Error fetching messages:", fetchError);
        return;
      }
      if (data) {
        data.forEach((row) => addMarker(row, view));
      }
    })();

    const subscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload: any) => {
          const newRow = payload.new;
          if (viewRef.current) {
            addMarker(newRow, viewRef.current);
          }
        }
      )
      .subscribe();

    const pointerMoveHandler = view.on("pointer-move", (event) => {
      (view.hitTest(event, { tolerance: 10 } as any) as Promise<any>).then(
        (response) => {
          let hoveredGraphic: Graphic | null = null;
          const markerResults = response.results.filter(
            (result: any) =>
              result.graphic &&
              result.graphic.attributes?.markerType === "paperPlane"
          );
          if (markerResults.length > 0) {
            hoveredGraphic = markerResults[0].graphic;
          }
          (view.container as HTMLElement).style.cursor = hoveredGraphic
            ? "pointer"
            : "default";

          view.graphics.forEach((graphic: Graphic) => {
            if (graphic.attributes?.markerType === "paperPlane") {
              if (graphic === hoveredGraphic) {
                if (graphic.symbol !== (graphic as any).hoverSymbol) {
                  graphic.symbol = (graphic as any).hoverSymbol;
                }
              } else {
                if (graphic.symbol !== (graphic as any).defaultSymbol) {
                  graphic.symbol = (graphic as any).defaultSymbol;
                }
              }
            }
          });

          if (hoveredGraphic) {
            const senderLat =
              typeof hoveredGraphic.attributes.sender_lat === "number"
                ? hoveredGraphic.attributes.sender_lat
                : parseFloat(hoveredGraphic.attributes.sender_lat);
            const senderLng =
              typeof hoveredGraphic.attributes.sender_lng === "number"
                ? hoveredGraphic.attributes.sender_lng
                : parseFloat(hoveredGraphic.attributes.sender_lng);
            const recipientPoint = hoveredGraphic.geometry as Point;
            const lineGeometry = {
              type: "polyline",
              paths: [
                [senderLng, senderLat],
                [recipientPoint.longitude, recipientPoint.latitude],
              ],
              spatialReference: { wkid: 4326 },
            };

            const lineSymbol = new SimpleLineSymbol({
              color: [76, 77, 76],
              width: 2,
              style: "dash",
            });

            const newLineGraphic = new Graphic({
              geometry: lineGeometry,
              symbol: lineSymbol,
            });

            if (lineGraphicRef.current) {
              view.graphics.remove(lineGraphicRef.current);
            }
            view.graphics.add(newLineGraphic);
            lineGraphicRef.current = newLineGraphic;
          } else {
            if (lineGraphicRef.current) {
              view.graphics.remove(lineGraphicRef.current);
              lineGraphicRef.current = null;
            }
          }
        }
      );
    });

    const clickHandler = view.on("click", (event) => {
      (view.hitTest(event, { tolerance: 10 } as any) as Promise<any>).then(
        (response) => {
          const markerResults = response.results.filter(
            (result: any) =>
              result.graphic &&
              result.graphic.attributes?.markerType === "paperPlane"
          );
          if (markerResults.length > 0) {
            const messages = markerResults.map((result: any) => {
              return {
                createdAt: result.graphic.attributes.created_at,
                letterContent: result.graphic.attributes.letterContent,
              };
            });
            setModalMessages(messages);
            setModalVisible(true);
          }
        }
      );
    });

    return () => {
      pointerMoveHandler.remove();
      clickHandler.remove();
      if (view) view.destroy();
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    if (location && viewRef.current) {
      const newCenter = new Point({
        longitude: location.lng,
        latitude: location.lat,
      });
      viewRef.current.center = newCenter;
    }
  }, [location]);

  useEffect(() => {
    const handleCenterMap = () => {
      if (location && viewRef.current) {
        const centerPoint = new Point({
          longitude: location.lng,
          latitude: location.lat,
        });
        viewRef.current.goTo({
          target: centerPoint,
          zoom: 8,
        });
      }
    };

    window.addEventListener("centerMap", handleCenterMap);
    return () => {
      window.removeEventListener("centerMap", handleCenterMap);
    };
  }, [location]);

  return (
    <div>
      <div ref={mapRef} style={{ width: "100vw", height: "100vh" }} />
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {modalVisible && (
        <MessageModal
          messages={modalMessages}
          onClose={() => setModalVisible(false)}
        />
      )}
    </div>
  );
};

export default ArcGISMap;
