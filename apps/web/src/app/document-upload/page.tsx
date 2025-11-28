import { DocumentUploader } from "../../components/common";

export default function DocumentUpload() {
  return (
    <div className="h-screen flex justify-center items-center">
      <DocumentUploader
        title="Regulatory Guidelines Documents"
        subtitle="Upload document"
      />
    </div>
  );
}
