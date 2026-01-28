// src/pages/JobApplicantsPage.jsx
import { useParams } from "react-router-dom";
import ManageApplications from "../components/ManageApplications";

export default function JobApplicantsPage() {
  const { jobId } = useParams();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Applicants for Job</h1>
      <ManageApplications jobId={jobId} />
    </div>
  );
}
