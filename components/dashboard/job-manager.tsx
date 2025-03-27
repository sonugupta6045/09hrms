"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { JobListing } from "@/lib/db/schema";

export function JobManager() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentJob, setCurrentJob] = useState<JobListing | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    minSalary: "",
    maxSalary: "",
    showSalary: false,
    status: "Draft",
    featured: false,
    closingDate: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/jobs");

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      department: "",
      location: "",
      type: "Full-time",
      description: "",
      requirements: "",
      responsibilities: "",
      benefits: "",
      minSalary: "",
      maxSalary: "",
      showSalary: false,
      status: "Draft",
      featured: false,
      closingDate: "",
    });
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Format the data
      const jobData = {
        title: formData.title,
        department: formData.department,
        location: formData.location,
        type: formData.type,
        description: formData.description,
        requirements: formData.requirements
          .split("\n")
          .filter((line) => line.trim() !== ""),
        responsibilities: formData.responsibilities
          .split("\n")
          .filter((line) => line.trim() !== ""),
        benefits: formData.benefits
          ? formData.benefits.split("\n").filter((line) => line.trim() !== "")
          : [],
        salary: {
          min: formData.minSalary
            ? Number.parseInt(formData.minSalary)
            : undefined,
          max: formData.maxSalary
            ? Number.parseInt(formData.maxSalary)
            : undefined,
          isVisible: formData.showSalary,
        },
        status: formData.status,
        featured: formData.featured,
        closingDate: formData.closingDate
          ? new Date(formData.closingDate)
          : undefined,
      };

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error("Failed to create job");
      }

      toast({
        title: "Success",
        description: "Job listing created successfully",
      });

      // Refresh the job list
      fetchJobs();

      // Reset form and close dialog
      resetForm();
      setIsCreating(false);
    } catch (err) {
      console.error("Error creating job:", err);
      toast({
        title: "Error",
        description: "Failed to create job listing. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditJob = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentJob?._id) return;

    try {
      // Format the data
      const jobData = {
        title: formData.title,
        department: formData.department,
        location: formData.location,
        type: formData.type,
        description: formData.description,
        requirements: formData.requirements
          .split("\n")
          .filter((line) => line.trim() !== ""),
        responsibilities: formData.responsibilities
          .split("\n")
          .filter((line) => line.trim() !== ""),
        benefits: formData.benefits
          ? formData.benefits.split("\n").filter((line) => line.trim() !== "")
          : [],
        salary: {
          min: formData.minSalary
            ? Number.parseInt(formData.minSalary)
            : undefined,
          max: formData.maxSalary
            ? Number.parseInt(formData.maxSalary)
            : undefined,
          isVisible: formData.showSalary,
        },
        status: formData.status,
        featured: formData.featured,
        closingDate: formData.closingDate
          ? new Date(formData.closingDate)
          : undefined,
      };

      const response = await fetch(`/api/jobs/${currentJob._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error("Failed to update job");
      }

      toast({
        title: "Success",
        description: "Job listing updated successfully",
      });

      // Refresh the job list
      fetchJobs();

      // Reset form and close dialog
      resetForm();
      setIsEditing(false);
      setCurrentJob(null);
    } catch (err) {
      console.error("Error updating job:", err);
      toast({
        title: "Error",
        description: "Failed to update job listing. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job listing?")) return;

    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      toast({
        title: "Success",
        description: "Job listing deleted successfully",
      });

      // Refresh the job list
      fetchJobs();
    } catch (err) {
      console.error("Error deleting job:", err);
      toast({
        title: "Error",
        description: "Failed to delete job listing. Please try again.",
        variant: "destructive",
      });
    }
  };

  const editJob = (job: JobListing) => {
    setCurrentJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      description: job.description,
      requirements: job.requirements.join("\n"),
      responsibilities: job.responsibilities.join("\n"),
      benefits: job.benefits?.join("\n") || "",
      minSalary: job.salary?.min?.toString() || "",
      maxSalary: job.salary?.max?.toString() || "",
      showSalary: job.salary?.isVisible || false,
      status: job.status,
      featured: job.featured,
      closingDate: job.closingDate
        ? new Date(job.closingDate).toISOString().split("T")[0]
        : "",
    });
    setIsEditing(true);
  };

  // Filter jobs based on search term and status
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Closed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => fetchJobs()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex gap-2 items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Job
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Job Listing</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create a new job listing.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateJob}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Job Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) =>
                          handleSelectChange("type", value)
                        }
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                          <SelectItem value="Remote">Remote</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Job Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">
                      Requirements (one per line)
                    </Label>
                    <Textarea
                      id="requirements"
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleInputChange}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="responsibilities">
                      Responsibilities (one per line)
                    </Label>
                    <Textarea
                      id="responsibilities"
                      name="responsibilities"
                      value={formData.responsibilities}
                      onChange={handleInputChange}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benefits">Benefits (one per line)</Label>
                    <Textarea
                      id="benefits"
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minSalary">Minimum Salary</Label>
                      <Input
                        id="minSalary"
                        name="minSalary"
                        type="number"
                        value={formData.minSalary}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxSalary">Maximum Salary</Label>
                      <Input
                        id="maxSalary"
                        name="maxSalary"
                        type="number"
                        value={formData.maxSalary}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showSalary"
                      checked={formData.showSalary}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("showSalary", checked)
                      }
                    />
                    <Label htmlFor="showSalary">Show Salary Range</Label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          handleSelectChange("status", value)
                        }
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Published">Published</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="closingDate">Closing Date</Label>
                      <Input
                        id="closingDate"
                        name="closingDate"
                        type="date"
                        value={formData.closingDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("featured", checked)
                      }
                    />
                    <Label htmlFor="featured">
                      Featured Job (shown on homepage)
                    </Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreating(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create Job</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Listings ({filteredJobs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedJobs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No job listings found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedJobs.map((job) => (
                  <TableRow key={job._id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.department}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{job.type}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(job.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          asChild
                        >
                          <a
                            href={`/jobs/${job._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => editJob(job)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => handleDeleteJob(job._id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Job Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job Listing</DialogTitle>
            <DialogDescription>
              Update the details of this job listing.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditJob}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Job Title</Label>
                  <Input
                    id="edit-title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department</Label>
                  <Input
                    id="edit-department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Job Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger id="edit-type">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Job Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-requirements">
                  Requirements (one per line)
                </Label>
                <Textarea
                  id="edit-requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-responsibilities">
                  Responsibilities (one per line)
                </Label>
                <Textarea
                  id="edit-responsibilities"
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-benefits">Benefits (one per line)</Label>
                <Textarea
                  id="edit-benefits"
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-minSalary">Minimum Salary</Label>
                  <Input
                    id="edit-minSalary"
                    name="minSalary"
                    type="number"
                    value={formData.minSalary}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-maxSalary">Maximum Salary</Label>
                  <Input
                    id="edit-maxSalary"
                    name="maxSalary"
                    type="number"
                    value={formData.maxSalary}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-showSalary"
                  checked={formData.showSalary}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("showSalary", checked)
                  }
                />
                <Label htmlFor="edit-showSalary">Show Salary Range</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleSelectChange("status", value)
                    }
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-closingDate">Closing Date</Label>
                  <Input
                    id="edit-closingDate"
                    name="closingDate"
                    type="date"
                    value={formData.closingDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("featured", checked)
                  }
                />
                <Label htmlFor="edit-featured">
                  Featured Job (shown on homepage)
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentJob(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Update Job</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
