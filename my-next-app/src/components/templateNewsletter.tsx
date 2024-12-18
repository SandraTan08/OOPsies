'use client';

import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { Save, Upload, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from 'sonner';
import { useSession } from 'next-auth/react';

export default function TemplateNewsletter() {
  const [savedNewsletters, setSavedNewsletters] = useState([]);
  const [selectedNewsletter, setSelectedNewsletter] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const textAreaRef = useRef(null);
  const { data: session } = useSession();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    console.log("Session data:", session);
    if (session && session.account) {
      fetchNewsletters();
    }
  }, [session]);

  const fetchNewsletters = async () => {
    try {
      const response = await axios.get(`${backendUrl}newsletter`);
      if (response.status === 200) {
        setSavedNewsletters(response.data);
      }
    } catch (error) {
      console.error('Error fetching newsletters:', error);
      toast.error('Failed to fetch newsletters.');
    }
  };

  const fetchNewsletterData = async (newsletterId) => {
    try {
      const response = await axios.get(`${backendUrl}newsletter/${newsletterId}`);
      const data = response.data;
      setTemplateName(data.templateName);
      setIntroduction(data.introduction);
      setConclusion(data.conclusion);
      setImagePreview(data.image ? `data:image/png;base64,${data.image}` : null);
    } catch (error) {
      console.error('Error fetching newsletter:', error);
      toast.error('Failed to fetch newsletter data.');
    }
  };

  const handleSelectChange = (e) => {
    const selectedNewsletterId = e.target.value;
    setSelectedNewsletter(selectedNewsletterId);
    if (selectedNewsletterId) fetchNewsletterData(selectedNewsletterId);
    else resetForm();
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim() || !introduction.trim() || !conclusion.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!session || !session.user) {
      toast.error('You must be logged in to save the template.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('accountId', session.account.accountId);
      formData.append('templateName', templateName);
      formData.append('introduction', introduction);
      formData.append('conclusion', conclusion);
      if (image) formData.append('image', image);

      console.log("Form data:", formData.get('accountId'), formData.get('templateName'), formData.get('introduction'), formData.get('conclusion'), formData.get('image'));

      await axios.post(`${backendUrl}newsletter/create`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Template saved successfully');
      fetchNewsletters();
      resetForm();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template.');
    }
  };

  const handleRemoveTemplate = async () => {
    if (!selectedNewsletter) return;
    try {
      await axios.delete(`${backendUrl}newsletter/delete/${selectedNewsletter}`);
      toast.success('Template removed successfully');
      setSelectedNewsletter('');
      fetchNewsletters();
    } catch (error) {
      console.error('Error removing template:', error);
      toast.error('Failed to remove template.');
    }
  };

  const resetForm = () => {
    setTemplateName('');
    setIntroduction('');
    setConclusion('');
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      <Toaster />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Template Newsletter</h1>

        {/* Template Name Field */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="templateName">Template Name</Label>
          <Input
            id="templateName"
            placeholder="Enter template name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
        </div>

        {/* Introduction Field */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="introduction">Introduction</Label>
          <Textarea
            id="introduction"
            placeholder="Enter introduction text"
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
          />
        </div>

        {/* Conclusion Field */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="conclusion">Conclusion</Label>
          <Textarea
            id="conclusion"
            placeholder="Enter conclusion text"
            value={conclusion}
            onChange={(e) => setConclusion(e.target.value)}
          />
        </div>

        {/* Image Upload Section */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="image">Upload Image</Label>
          <div className="flex items-center ">
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <Button className="bg-gray-700 hover:bg-gray-500" onClick={() => document.getElementById('image')?.click()}>
              <Upload className="mr-2 h-4 w-4" /> Choose Image
            </Button>
            {image && <span className="text-sm text-muted-foreground">{image.name}</span>}
          </div>
          {imagePreview ? (
            <img src={imagePreview} alt="Template Preview" className="mt-4 rounded-md max-h-64" />
          ) : (
            <p className="text-sm text-muted-foreground">No image available</p>
          )}
        </div>

        {/* Preview Section */}
        <div className="mt-8 mb-6">
          <Label htmlFor="preview">Preview</Label>
          <Textarea
            ref={textAreaRef}
            id="preview"
            className="mt-1 h-64"
            value={`Dear Customer,

${introduction}

[Image placed here]

We've curated something special for you! Based on your recent purchases and browsing history, here are some exclusive offers:

${conclusion}

Warm regards,
Marketing team`}
          readOnly/>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-6">
          <Button onClick={handleSaveTemplate} className="bg-gray-700 hover:bg-gray-500flex items-center">
            <Save className="mr-2 h-4 w-4" /> Save Template
          </Button>
          <Button variant="destructive" onClick={handleRemoveTemplate} disabled={!selectedNewsletter} className="flex items-center">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>

        {/* Template Selection for Deletion */}
        <div className="space-y-2">
          <Label htmlFor="removeTemplate">Remove Existing Template</Label>
          <select
            id="removeTemplate"
            value={selectedNewsletter}
            onChange={handleSelectChange}
            className="flex h-10 w-full items-center rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">Select template</option>
            {savedNewsletters.map((newsletter) => (
              <option key={newsletter.newsletterId} value={newsletter.newsletterId}>
                {newsletter.newsletterId} - {newsletter.templateName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
