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
import { set } from 'zod';

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

  useEffect(() => {
    if (session && session.account) {
      fetchNewsletters();
    }
  }, [session]);

  const fetchNewsletters = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/newsletter`);
      if (response.status === 200) {
        setSavedNewsletters(response.data);
        console.log('Fetched newsletters:', response.data);
      }
    } catch (error) {
      console.error('Error fetching newsletters:', error);
      toast.error('Failed to fetch newsletters.');
    }
  };

  const fetchNewsletterData = async (newsletterId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/newsletter/${newsletterId}`);
      const data = response.data;
      setTemplateName(data.templateName);
      setIntroduction(data.introduction);
      setConclusion(data.conclusion);
      if (data.image) {
        setImagePreview(`data:image/jpeg;base64,${data.image}`); // Change MIME type if needed
      } else {
        setImagePreview(null);
      }
    } catch (error) {
      console.error('Error fetching newsletter:', error);
      toast.error('Failed to fetch newsletter data.');
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedNewsletterId = e.target.value;
    setSelectedNewsletter(selectedNewsletterId);

    if (selectedNewsletterId) {
      fetchNewsletterData(selectedNewsletterId); // Fetch data of the selected newsletter
    } else {
      resetForm(); // Clear the form if no newsletter is selected
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveTemplate = async () => {
    const errors = [];
    if (!templateName.trim()) errors.push('Please enter a template name');
    if (!introduction.trim()) errors.push('Introduction cannot be empty');
    if (!conclusion.trim()) errors.push('Conclusion cannot be empty');

    if (errors.length > 0) {
      toast.error(errors.join('. '));
      return;
    }

    try {
      const formData = new FormData();
      formData.append('templateName', templateName);
      formData.append('introduction', introduction);
      formData.append('conclusion', conclusion);
      if (image) {
        formData.append('image', image);
      }

      console.log(formData.get('image'));
      await axios.post('http://localhost:8080/api/v1/newsletter/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Template saved successfully');
      fetchNewsletters();
      resetForm();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template. Please try again');
    }
  };

  const handleRemoveTemplate = async () => {
    if (!selectedNewsletter) return;

    try {
      await axios.delete(`http://localhost:8080/api/v1/newsletter/delete/${selectedNewsletter}`);
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
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Toaster />

      <div className="space-y-2">
        <Label htmlFor="templateName">Template Name</Label>
        <Input
          id="templateName"
          placeholder="Enter template name"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="introduction">Introduction</Label>
        <Textarea
          id="introduction"
          placeholder="Enter introduction text"
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="conclusion">Conclusion</Label>
        <Textarea
          id="conclusion"
          placeholder="Enter conclusion text"
          value={conclusion}
          onChange={(e) => setConclusion(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Upload Image</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <Button onClick={() => document.getElementById('image')?.click()}>
            <Upload className="mr-2 h-4 w-4" /> Choose Image
          </Button>
          {image && <span className="text-sm text-muted-foreground">{image.name}</span>}
        </div>
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Template Preview"
            className="mt-4 rounded-md max-h-64"
          />
        ) : (
          <p className="text-sm text-muted-foreground">No image available</p>
        )}
      </div>

      <div className="mt-8">
        <Label htmlFor="preview">Preview</Label>
        <Textarea
          ref={textAreaRef}
          id="preview"
          className="mt-1 h-64"
          value={`Dear Customer,

${introduction}

Personalized Product Recommendations:
Top Picks for You:

${conclusion}

Warm regards,
Marketing team
[Image placed here]`}
          readOnly
        />
      </div>

      <Button onClick={handleSaveTemplate}>
        <Save className="mr-2 h-4 w-4" /> Save Template
      </Button>

      <div className="space-y-2">
        <Label htmlFor="removeTemplate">Remove Existing Template</Label>
        <div className="flex items-center space-x-2">
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
          <Button variant="destructive" onClick={handleRemoveTemplate} disabled={!selectedNewsletter}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>
    </div>
  );
}