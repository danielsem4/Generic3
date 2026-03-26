import { useState } from "react";
import type { IClinic } from "@/common/types/clinic";

interface Props {
  clinic: IClinic;
  onSave: (data: Partial<IClinic>) => void;
}

export const useClinicEditCard = ({ clinic, onSave }: Props) => {
  const [name, setName] = useState(clinic.name || "");
  const [url, setUrl] = useState(clinic.clinic_url || "");
  const [imageUrl, setImageUrl] = useState(clinic.clinic_image_url || "");
  const [isResearch, setIsResearch] = useState(clinic.is_research);

  const handleSave = () => {
    onSave({
      name,
      clinic_url: url,
      clinic_image_url: imageUrl,
      is_research: isResearch,
    });
  };

  return {
    name,setName,
    url,setUrl,
    imageUrl,setImageUrl,
    isResearch,setIsResearch,
    handleSave,
  };
};