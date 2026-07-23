import { useState, useCallback } from "react";

type TryOnStatus = "idle" | "loading" | "success" | "error";

interface TryOnResult {
  status: TryOnStatus;
  imagenResultado: string | null;
  error: string | null;
  generar: (personaFile: File, prendaUrl: string) => Promise<void>;
  reset: () => void;
}

/**
 * Hook que llama al backend FastAPI que a su vez llama a CatVTON en HF Spaces.
 * personaFile: foto que sube el usuario
 * prendaUrl: URL de la foto del producto en /public/products/...
 */
export function useTryOn(): TryOnResult {
  const [status, setStatus]               = useState<TryOnStatus>("idle");
  const [imagenResultado, setImagen]      = useState<string | null>(null);
  const [error, setError]                 = useState<string | null>(null);

  const generar = useCallback(async (personaFile: File, prendaUrl: string) => {
    setStatus("loading");
    setImagen(null);
    setError(null);

    try {
      // Descargar la imagen del producto como File
      const prendaResponse = await fetch(prendaUrl);
      if (!prendaResponse.ok) throw new Error("No se pudo obtener la imagen del producto");
      const prendaBlob = await prendaResponse.blob();
      const prendaFile = new File([prendaBlob], "prenda.jpg", { type: "image/jpeg" });

      // Preparar FormData
      const formData = new FormData();
      formData.append("persona", personaFile);
      formData.append("prenda", prendaFile);
      formData.append("categoria", "upper_body"); // prendas de alpaca = parte superior

      // Llamar al backend FastAPI
      const BACKEND = process.env.NEXT_PUBLIC_TRYON_API || "http://localhost:8000";
      const response = await fetch(`${BACKEND}/api/tryon`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ detail: "Error desconocido" }));
        throw new Error(err.detail || `Error ${response.status}`);
      }

      const data = await response.json();

      if (!data.ok || !data.imagen) {
        throw new Error(data.mensaje || "No se recibió imagen del servidor");
      }

      setImagen(data.imagen);
      setStatus("success");

    } catch (err: any) {
      setError(err.message || "Error al generar la prueba virtual");
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setImagen(null);
    setError(null);
  }, []);

  return { status, imagenResultado, error, generar, reset };
}