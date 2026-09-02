import { ArrowDown } from "lucide-react";

type AcademyFlowDiagramProps = {
  layers: string[][];
  title?: string;
};

const layerLabels = ["Источники эффектов", "Центр правил", "Результат"];

export const AcademyFlowDiagram = ({ layers, title }: AcademyFlowDiagramProps) => {
  const accessibleDescription = layers.map((layer) => layer.join(", ")).join("; затем ");

  return (
    <figure
      aria-label={`${title || "Схема"}: ${accessibleDescription}`}
      className="academy-flow"
      role="img"
    >
      {title ? <figcaption className="academy-flow__title">{title}</figcaption> : null}

      <div className="academy-flow__layers">
        {layers.map((layer, layerIndex) => (
          <div className="academy-flow__step" key={`${layer.join("-")}-${layerIndex}`}>
            <div className="academy-flow__layer">
              <span className="academy-flow__label">
                {layerLabels[layerIndex] || `Шаг ${layerIndex + 1}`}
              </span>
              <div className="academy-flow__nodes">
                {layer.map((node) => (
                  <span className="academy-flow__node" key={node}>
                    {node}
                  </span>
                ))}
              </div>
            </div>

            {layerIndex < layers.length - 1 ? (
              <span aria-hidden="true" className="academy-flow__arrow">
                <ArrowDown className="h-5 w-5" />
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </figure>
  );
};
