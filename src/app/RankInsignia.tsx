import type { RankInsigniaDefinition } from "../domain/ranks";

interface RankInsigniaProps {
  className?: string;
  insignia: RankInsigniaDefinition;
}

export function RankInsignia({ className = "", insignia }: RankInsigniaProps) {
  return (
    <img
      alt=""
      aria-hidden="true"
      className={`rank-insignia ${className}`.trim()}
      src={insignia.imagePath}
    />
  );
}
