import type { IQOptionItem, QComponentType } from "@/common/types/measurement";

export function useOptionScoring(
  options: IQOptionItem[],
  componentType: QComponentType,
  onChange: (options: IQOptionItem[]) => void,
) {
  const isSingleSelect =
    componentType !== "multiSelect" && componentType !== "cardMultiSelect";

  function handleToggleCorrect(index: number) {
    const updated = options.map((opt, i) => {
      if (i === index) {
        const nextCorrect = !opt.isCorrect;
        return {
          ...opt,
          isCorrect: nextCorrect,
          score: nextCorrect ? (opt.score ?? 0) : 0,
        };
      }
      if (isSingleSelect) {
        return { ...opt, isCorrect: false, score: 0 };
      }
      return opt;
    });
    onChange(updated);
  }

  function handleScoreChange(index: number, score: number) {
    const updated = options.map((opt, i) => {
      if (i !== index) return opt;
      return { ...opt, score, isCorrect: score > 0 ? true : opt.isCorrect };
    });
    onChange(updated);
  }

  const totalScore = options.reduce(
    (sum, opt) => sum + (opt.isCorrect ? (opt.score ?? 0) : 0),
    0,
  );

  return { handleToggleCorrect, handleScoreChange, totalScore };
}
