import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export default function ConsultantDetail() {
  const { id } = useParams();
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/consultants" className="text-sm text-primary hover:underline">← Back to consultants</Link>
      <h1 className="text-3xl font-bold">Consultant #{id}</h1>
      <Card className="p-6">
        <p className="text-muted-foreground">
          This is a placeholder profile. Integrate your real consultant data here (bio, specialties, fees, availability).
        </p>
        <Button className="mt-4">Request Appointment</Button>
      </Card>
    </div>
  );
}