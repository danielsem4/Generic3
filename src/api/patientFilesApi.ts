import api from "@/lib/axios";

export interface IPatientFile {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  uploaded_at: string;
  uploaded_by: {
    id: string;
    full_name: string;
    role: string;
  };
  file_url: string;
}

export const getPatientFiles = async (clinicId: string, patientId: string): Promise<IPatientFile[]> => {
  const { data } = await api.get(`/api/v1/clinics/${clinicId}/patients/${patientId}/files/`);
  return Array.isArray(data) ? data : data.results ?? [];
};

export const uploadPatientFile = async (clinicId: string, patientId: string, file: File, fileName: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("file_name", fileName);

  const { data } = await api.post(
    `/api/v1/clinics/${clinicId}/patients/${patientId}/files/`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
};

export const getFileUrl = async (clinicId: string, patientId: string, fileId: string) => {
  const { data } = await api.get(`/api/v1/clinics/${clinicId}/patients/${patientId}/files/${fileId}/url/`);
  return data; 
};

export const deletePatientFile = async (clinicId: string, patientId: string, fileId: string) => {
  await api.delete(`/api/v1/clinics/${clinicId}/patients/${patientId}/files/${fileId}/`);
};