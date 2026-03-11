"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { mockUltrasounds, mockPatients } from "@/lib/mock-data";
import { formatDate, cn } from "@/lib/utils";
import {
  Search,
  Upload,
  Grid,
  List,
  Image as ImageIcon,
  ZoomIn,
  Download,
  Share2,
  MessageSquare,
  Clock,
  User,
  Ruler,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Baby,
} from "lucide-react";
import type { UltrasoundImage } from "@/lib/types";

export default function UltrasoundPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState<UltrasoundImage | null>(
    null
  );
  const [showImageModal, setShowImageModal] = useState(false);

  const getPatientName = (patientId: string) => {
    const patient = mockPatients.find((p) => p.id === patientId);
    return patient?.fullName || "Unknown";
  };

  const filteredImages = mockUltrasounds.filter((img) => {
    const patientName = getPatientName(img.patientId);
    const matchesSearch = patientName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || img.reviewStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewImage = (image: UltrasoundImage) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const statusIcon = {
    pending: <Clock className="w-4 h-4 text-amber-500" />,
    reviewed: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    flagged: <AlertTriangle className="w-4 h-4 text-red-500" />,
  };

  const statusBadge = {
    pending: "warning" as const,
    reviewed: "success" as const,
    flagged: "danger" as const,
  };

  return (
    <DashboardLayout
      title="Ultrasound Imaging"
      subtitle="Capture, store, and review ultrasound scans"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-900/30">
              <ImageIcon className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockUltrasounds.length}</p>
              <p className="text-sm text-slate-500">Total Scans</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {
                  mockUltrasounds.filter((u) => u.reviewStatus === "pending")
                    .length
                }
              </p>
              <p className="text-sm text-slate-500">Pending Review</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {
                  mockUltrasounds.filter((u) => u.reviewStatus === "flagged")
                    .length
                }
              </p>
              <p className="text-sm text-slate-500">Flagged</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {
                  mockUltrasounds.filter((u) => u.reviewStatus === "reviewed")
                    .length
                }
              </p>
              <p className="text-sm text-slate-500">Reviewed</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Controls */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-3 flex-wrap">
            <div className="w-64">
              <Input
                placeholder="Search by patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
              />
            </div>
            <Select
              options={[
                { value: "all", label: "All Status" },
                { value: "pending", label: "Pending Review" },
                { value: "reviewed", label: "Reviewed" },
                { value: "flagged", label: "Flagged" },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-700 shadow-sm"
                    : ""
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === "list"
                    ? "bg-white dark:bg-slate-700 shadow-sm"
                    : ""
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <Button variant="primary">
              <Upload className="w-4 h-4" />
              Upload Scan
            </Button>
          </div>
        </div>
      </Card>

      {/* Image Gallery */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, index) => (
            <Card
              key={image.id}
              variant="elevated"
              padding="none"
              hover
              className="overflow-hidden animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => handleViewImage(image)}
            >
              {/* Image Preview */}
              <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-transparent" />
                <Baby className="w-16 h-16 text-slate-600" />
                <div className="absolute top-3 right-3">
                  {statusIcon[image.reviewStatus]}
                </div>
                <div className="absolute bottom-3 left-3">
                  <Badge
                    variant="default"
                    size="sm"
                    className="bg-black/50 text-white border-0"
                  >
                    {image.gestationalAge.weeks}w{image.gestationalAge.days}d
                  </Badge>
                </div>
                <div className="absolute bottom-3 right-3">
                  <Badge
                    variant={
                      image.quality === "excellent"
                        ? "success"
                        : image.quality === "good"
                        ? "info"
                        : image.quality === "fair"
                        ? "warning"
                        : "danger"
                    }
                    size="sm"
                  >
                    {image.quality}
                  </Badge>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {getPatientName(image.patientId)}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {formatDate(image.captureDate)}
                    </p>
                  </div>
                  <Badge variant={statusBadge[image.reviewStatus]} size="sm">
                    {image.reviewStatus}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                  {image.findings}
                </p>
                <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                  <User className="w-3 h-3" />
                  <span>{image.capturedBy}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card variant="elevated">
          <CardContent className="p-0">
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredImages.map((image, index) => (
                <div
                  key={image.id}
                  className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                  onClick={() => handleViewImage(image)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-14 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0">
                      <Baby className="w-8 h-8 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {getPatientName(image.patientId)}
                        </h3>
                        <Badge variant="info" size="sm">
                          {image.gestationalAge.weeks}w
                          {image.gestationalAge.days}d
                        </Badge>
                        <Badge
                          variant={statusBadge[image.reviewStatus]}
                          size="sm"
                        >
                          {image.reviewStatus}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 truncate mt-1">
                        {image.findings}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-900 dark:text-white">
                        {formatDate(image.captureDate)}
                      </p>
                      <p className="text-xs text-slate-500">
                        by {image.capturedBy}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Detail Modal */}
      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        title="Ultrasound Details"
        size="xl"
      >
        {selectedImage && (
          <div className="space-y-6">
            {/* Image Preview */}
            <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center relative">
              <Baby className="w-24 h-24 text-slate-600" />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge
                  variant="default"
                  className="bg-black/50 text-white border-0"
                >
                  {selectedImage.gestationalAge.weeks}w
                  {selectedImage.gestationalAge.days}d
                </Badge>
                <Badge
                  variant={
                    selectedImage.quality === "excellent"
                      ? "success"
                      : selectedImage.quality === "good"
                      ? "info"
                      : selectedImage.quality === "fair"
                      ? "warning"
                      : "danger"
                  }
                >
                  {selectedImage.quality} quality
                </Badge>
              </div>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-black/50 text-white hover:bg-black/70"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-black/50 text-white hover:bg-black/70"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Patient & Capture Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <p className="text-xs text-slate-500">Patient</p>
                <p className="font-semibold">
                  {getPatientName(selectedImage.patientId)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <p className="text-xs text-slate-500">Capture Date</p>
                <p className="font-semibold">
                  {formatDate(selectedImage.captureDate)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <p className="text-xs text-slate-500">Captured By</p>
                <p className="font-semibold">{selectedImage.capturedBy}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <p className="text-xs text-slate-500">Review Status</p>
                <div className="flex items-center gap-2">
                  {statusIcon[selectedImage.reviewStatus]}
                  <span className="font-semibold capitalize">
                    {selectedImage.reviewStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Measurements */}
            {selectedImage.measurements && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-brand-500" />
                  Measurements
                </h4>
                <div className="grid grid-cols-5 gap-3">
                  {selectedImage.measurements.bpd && (
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                      <p className="text-xs text-slate-500">BPD</p>
                      <p className="text-lg font-bold">
                        {selectedImage.measurements.bpd}
                      </p>
                      <p className="text-xs text-slate-400">mm</p>
                    </div>
                  )}
                  {selectedImage.measurements.fl && (
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                      <p className="text-xs text-slate-500">FL</p>
                      <p className="text-lg font-bold">
                        {selectedImage.measurements.fl}
                      </p>
                      <p className="text-xs text-slate-400">mm</p>
                    </div>
                  )}
                  {selectedImage.measurements.ac && (
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                      <p className="text-xs text-slate-500">AC</p>
                      <p className="text-lg font-bold">
                        {selectedImage.measurements.ac}
                      </p>
                      <p className="text-xs text-slate-400">mm</p>
                    </div>
                  )}
                  {selectedImage.measurements.hc && (
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                      <p className="text-xs text-slate-500">HC</p>
                      <p className="text-lg font-bold">
                        {selectedImage.measurements.hc}
                      </p>
                      <p className="text-xs text-slate-400">mm</p>
                    </div>
                  )}
                  {selectedImage.measurements.efw && (
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                      <p className="text-xs text-slate-500">EFW</p>
                      <p className="text-lg font-bold">
                        {selectedImage.measurements.efw}
                      </p>
                      <p className="text-xs text-slate-400">g</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Findings */}
            <div>
              <h4 className="font-semibold mb-3">Findings</h4>
              <p className="text-slate-600 dark:text-slate-400 p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                {selectedImage.findings}
              </p>
            </div>

            {/* Annotations */}
            <div>
              <h4 className="font-semibold mb-3">Annotations</h4>
              <div className="flex flex-wrap gap-2">
                {selectedImage.annotations.map((annotation) => (
                  <Badge key={annotation} variant="outline" size="md">
                    {annotation}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Reviewer Info */}
            {selectedImage.reviewedBy && (
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium">
                    Reviewed by {selectedImage.reviewedBy}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button variant="primary">
                <Eye className="w-4 h-4" />
                Mark as Reviewed
              </Button>
              <Button variant="outline">
                <MessageSquare className="w-4 h-4" />
                Request Teleconsult
              </Button>
              <Button variant="ghost">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}



