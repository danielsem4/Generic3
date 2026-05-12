import { getFileUrl } from "@/api/patientFilesApi";

export const getFileType = (fileName: string) => {
  const name = fileName.toLowerCase();

  if (name.match(/\.(pdf|png|jpg|jpeg)$/)) return "viewable";
  if (name.match(/\.(doc|docx|xls|xlsx)$/)) return "office";

  return "other";
};

export const viewFile = async (
  clinicId: string,
  userId: string,
  fileId: string,
  fileName: string
) => {
  const res = await getFileUrl(clinicId, userId, fileId);
  const url = res.url || res;

  if (!url) return;

  const type = getFileType(fileName);

  if (type === "viewable") {
    window.open(url, "_blank");
  } else if (type === "office") {
    const viewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`;
    window.open(viewerUrl, "_blank");
  } else {
    await downloadFile(clinicId, userId, fileId, fileName);
  }
};

export const downloadFile = async (
  clinicId: string,
  userId: string,
  fileId: string,
  fileName: string
) => {
  const res = await getFileUrl(clinicId, userId, fileId);
  const url = res.url || res;

  if (!url) return;

  const response = await fetch(url);
  const blob = await response.blob();

  const blobUrl = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = fileName;

  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(blobUrl);
};