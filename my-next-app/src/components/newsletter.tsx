// newsletter.tsx
'use client'

import axios from 'axios';
import { useState, useRef, useEffect } from 'react'
import { Save, Copy, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast, Toaster } from 'sonner'  // Ensure `sonner` is installed and imported
import { useSession, signIn, signOut } from 'next-auth/react'



const brevoApiKey = process.env.NEXT_PUBLIC_resend_api_key;

export default function Newsletter() {
  const [template, setTemplate] = useState({
    newsletterId: null,
    templateName: null,
    customerName: null,
    introduction: null,
    conclusion: null,
    image: null,
    customerTier: null as string | null,
    products: [] // Changed to an array to store products dynamically
  })

  const [savedNewsletters, setSavedNewsletters] = useState([]); // State for saved newsletters
  const [selectedNewsletter, setSelectedNewsletter] = useState(''); // State for selected newsletter
  const [customerEmail, setCustomerEmail] = useState(''); // State for customer email
  const [customerName, setCustomerName] = useState(''); // State for customer Name

  const [numProducts, setNumProducts] = useState(0); // New state for number of products 
  const textAreaRef = useRef(null); // Reference for the textarea
  const { data: session, status } = useSession();
  const [emailType, setEmailType] = useState('personalized'); // Track selected email type
  const [customerTier, setCustomerTier] = useState(''); // State for customer tier
  const tierDisplayNames = {
    B: "Bronze",
    S: "Silver",
    G: "Gold",
  };
  // State to store customerId from URL
  const [customerId, setCustomerId] = useState<string | null>(null);


  useEffect(() => {
    if (session && session.account) {
      console.log(session);
      fetchNewsletters();
      if (emailType === 'personalized') {
        const path = window.location.pathname; // Get current path
        const match = path.match(/\/newsletter\/(\d+)/); // Extract customerId from URL
        if (match) {
          const extractedCustomerId = match[1]; // Set extracted customerId
          setCustomerId(extractedCustomerId); // Update customerId state
        }
      }
    }
  }, [session, emailType]); // Dependencies include session and emailType

  useEffect(() => {
    if (customerId) {
      fetchCustomerData(customerId); // Fetch customer data once customerId is set
    }
  }, [customerId]); // Only triggers when customerId changes

  const fetchCustomerData = async (customerId: string) => {
    if (!customerId) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1/customers/byCustomer?customerId=${customerId}`);
      const customerData = await response.json();
      console.log(customerData);
      setCustomerEmail(customerData.customerEmail);
      setCustomerName(customerData.customerName);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };

  const fetchNewsletters = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/newsletter');
      if (response.status === 200) {
        setSavedNewsletters(response.data);
        console.log('Fetched newsletters:', response.data);
      } else {
        console.error('Failed to fetch newsletters.');
      }
    } catch (error) {
      console.error('Error fetching newsletters:', error);
    }
  };

  const fetchNewsletterData = async (newsletterId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/newsletter/${newsletterId}`);
      const data = await response.json();
      console.log('Fetched newsletter data:', data);

      setTemplate({
        newsletterId: data.newsletterId,
        templateName: data.templateName,
        customerName: data.customerName,
        introduction: data.introduction,
        conclusion: data.conclusion,
        image: data.image,
        products: data.products
      });
    } catch (error) {
      console.error("Error fetching newsletter:", error);
    }
  };

  const handleSelectChange = (e) => {
    const selectedNewsletterId = e.target.value;
    setSelectedNewsletter(selectedNewsletterId);
    fetchNewsletterData(selectedNewsletterId); // Fetch data when selection changes
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  if (!session) {
    window.location.href = '/'; // Redirect to login page without extra params
    return null; // Render nothing during the redirect
  }

  // Initialize products based on numProducts
  const handleNumProductsChange = (e) => {
    const count = Math.max(0, Math.min(10, e.target.value)); // Limit to a range
    setNumProducts(count);

    // Update products array based on new count
    setTemplate(prev => {
      const updatedProducts = Array.from({ length: count }, (_, index) => ({
        productName: '',
        price: 0,
        discountType: 'none', // New field to track discount type
        discountPer: 0, // Discount percentage or amount
        discountAmt: 0,
        promoCode: '', // Promo code for discount type 1
        relatedProduct: '', // Related product for discount type 2
      }));
      return { ...prev, products: updatedProducts };
    });
  };

  const handleChange = (e, productIndex) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Check if the field is numeric and needs formatting
    if (name === 'price' || name === 'discountPer' || name === 'discountAmt') {
      let numericValue = parseFloat(value);
      formattedValue = isNaN(numericValue) ? 0 : Math.max(0, parseFloat(numericValue.toFixed(2))); // Ensure 2 decimal places
    }

    setTemplate(prev => {
      const updatedProducts = [...prev.products];
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        [name]: formattedValue  // Set either the formatted numeric value or the original string
      };
      return { ...prev, products: updatedProducts };
    });
  };

  const handleSave = async () => {
    console.log("Saving template");

    if (!session || !session.account) {
      toast.error("You must be logged in to save the template.");
      return;
    }

    const { newsletterId } = template;

    if (!newsletterId) {
      toast.error("No newsletter selected to save.");
      return;
    }

    // Add user accountId to the template payload
    const payload = {
      customerName: template.customerName,
      accountId: session.account.accountId,
      products: template.products,
    };

    try {
      const response = await fetch(`http://localhost:8080/api/v1/newsletter/update/${newsletterId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Send the payload
        credentials: "include", // Include session cookies
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        toast.error(errorMessage);
        return;
      }

      const message = await response.text();
      toast.success(message);
      console.log("Save response:", message);
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("An error occurred while saving the template.");
    }
  };

  const handleCopy = () => {
    console.log('Copying template');
    if (textAreaRef.current) {
      navigator.clipboard.writeText(textAreaRef.current.value)
        .then(() => {
          toast.success("Copied to clipboard!");
        })
        .catch((err) => {
          toast.error("Failed to copy: ", err);
          console.error("Failed to copy: ", err);
        });
    }
  }

  const generateTemplateHTML = (template) => {
    const displayName = template.customerName
      ? template.customerName
      : `${tierDisplayNames[template.customerTier] || template.customerTier} Customer`;

    const productList = template.products.map((product, index) => {
      let productDetails = `<li>${index + 1}. ${product.productName}<br/>Price: $${product.price}`;

      if (product.discountType === 'discountCode' && product.discountPer && product.promoCode) {
        productDetails += `<br/>Discount: ${product.discountPer}% off with code: ${product.promoCode}`;
      }

      if (product.discountType === 'relatedProduct' && product.discountAmt && product.relatedProduct) {
        productDetails += `<br/>Discount: Save $${product.discountAmt} when you buy with ${product.relatedProduct}`;
      }

      productDetails += `</li>`;
      return productDetails;
    }).join('');

    const imageSection = template.image
      ? `<p><img src="data:image/png;base64,${template.image}" alt="Newsletter Image" style="max-width:100%; height:auto;" /></p>`
      : '';

    return `
    <div>
      <p>Dear ${displayName},</p>
      <p>${template.introduction}</p>
      <p>${imageSection} <!-- Insert image here --> hello </p>
      <p>We've curated something special for you! Based on your recent purchases and browsing history, here are some exclusive offers:</p>
      <ul>${productList}</ul>
      <p>Take advantage of these personalized offers and discover more with Timperio. Shop now and enjoy the best deals tailored just for you!</p>
      <p>${template.conclusion}</p>
      <p>Warm regards,<br/>Marketing team</p>
    </div>
  `;
  };

  const handleSend = async () => {
    // Validate input based on email type
    if (emailType === 'personalized' && !customerEmail) {
      toast.error('Please enter a customer email.');
      return;
    }
    if (emailType === 'mass' && !template.customerTier) {
      toast.error('Please select a customer tier.');
      return;
    }

    let recipientEmails = [];

    // Fetch recipient emails for mass emails
    if (emailType === 'mass') {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/customers/byTier?tier=${template.customerTier}`);
        const customers = await response.json();

        // Filter out customers with null or empty emails
        recipientEmails = customers
          .filter(customer => customer.customerEmail) // Ensure email is non-null and non-empty
          .map(customer => ({ email: customer.customerEmail }));

        if (recipientEmails.length === 0) {
          toast.error('No valid emails found for the selected tier.');
          return;
        }

        toast.message(`Sending newsletter to ${recipientEmails.length} customers in tier ${template.customerTier}`);
      } catch (error) {
        console.error('Error fetching customers by tier:', error);
        toast.error('Failed to retrieve customers for the selected tier.');
        return;
      }
    }

    // Generate HTML content from the template
    const htmlContent = generateTemplateHTML(template);

    try {
      // Prepare email data based on email type
      const emailData = {
        sender: { email: 'amos.chan.2022@smu.edu.sg', name: 'Amos' },
        to: emailType === 'personalized' ? [{ email: customerEmail }] : recipientEmails,
        subject: 'Personalized Newsletter',
        htmlContent,
      };

      const response = await axios.post(
        'https://api.sendinblue.com/v3/smtp/email',
        emailData,
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': brevoApiKey,
          },
        }
      );

      if (response.status !== 201) {
        console.error('Error sending email:', response.data);
        toast.error('Error sending email');
        return;
      }

      console.log('Email sent successfully:', response.data);
      toast.success('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('An error occurred while sending the email.');
    }
  };



  ;

  const handleDiscountTypeChange = (e, index) => {
    const { value } = e.target;
    setTemplate(prev => {
      const updatedProducts = [...prev.products];
      updatedProducts[index].discountType = value; // Set discount type for the product
      return { ...prev, products: updatedProducts };
    });
  }

  return (
    <div>
      <Toaster />
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-100 border-b flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">Personalized Newsletter</h1>
            <select
              className="ml-4 py-2 px-3 rounded-lg border ml-auto"
              value={selectedNewsletter}
              onChange={handleSelectChange}
            >
              <option value="" disabled hidden>Select a newsletter</option>
              {savedNewsletters.map((newsletter) => (
                <option value={newsletter.newsletterId}>{newsletter.newsletterId} - {newsletter.templateName}</option>
              ))}
            </select>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <Label htmlFor="templateName">Template Name</Label>
              <Input
                id="templateName"
                name="templateName"
                value={template.templateName}
                placeholder="Choose template from above"
                onChange={(e) => setTemplate({ ...template, templateName: e.target.value })}
                className="mt-1"
                readOnly
              />
            </div>
            <div>
              {session.account.role !== 'Admin' && (
                <div className="mb-6">
                  <Label>Email Type</Label>
                  <div className="flex space-x-4 mt-1">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="emailType"
                        value="personalized"
                        checked={emailType === 'personalized'}
                        onChange={() => setEmailType('personalized')}
                      />
                      <span>Personalized Email</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="emailType"
                        value="mass"
                        checked={emailType === 'mass'}
                        onChange={() => setEmailType('mass')}
                      />
                      <span>Mass Email</span>
                    </label>
                  </div>
                </div>
              )}
              {session.account.role !== 'Admin' && emailType === 'personalized' && (
                <div className="mb-6">
                  <Label> Customer Email</Label>
                  <Input
                    id="customerEmail"
                    name="customerEmail"
                    type="email"
                    value={customerEmail}
                    placeholder="Enter customer email"
                    className="mt-1"
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
              )}
              {session.account.role !== 'Admin' && emailType === 'mass' && (
                <div className="mb-6">
                  <Label htmlFor="customerTier">Customer Tier</Label>
                  <select
                    id="customerTier"
                    name="customerTier"
                    value={template.customerTier} // Assuming this state will now represent the selected tier
                    onChange={(e) => setTemplate((prevTemplate) => ({ ...prevTemplate, customerTier: e.target.value, }))
                    } // Update this state based on selection
                    className="w-full mt-1 px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded-md"
                  >
                    <option value="" disabled>Select a tier</option>
                    <option value="B">Bronze</option>
                    <option value="S">Silver</option>
                    <option value="G">Gold</option>
                  </select>
                </div>
              )}

              {session.account.role !== 'Admin' && emailType === 'personalized' && (
                <div className="mb-6">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    name="customerName"
                    value={customerName}
                    placeholder="Enter customer name"
                    onChange={(e) => setTemplate({ ...template, customerName: e.target.value })}
                    className="mt-1"
                  />
                </div>
              )}

              {session.account.role !== 'Admin' && (
                <div className="mb-6">
                  <Label htmlFor="numProducts">Number of Products</Label>
                  <Input
                    id="numProducts"
                    type="number"
                    min="0"
                    max="10"
                    value={numProducts}
                    placeholder="Enter number of products"
                    onChange={handleNumProductsChange}
                    className="mt-1"
                  />
                </div>
              )}

              {template.products.map((product, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h2 className="text-lg font-semibold mb-2">Product {index + 1}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`product-${index}-name`}>Product Name</Label>
                      <Input
                        id={`product-${index}-name`}
                        name="productName"
                        value={product.productName}
                        placeholder="Enter product name"
                        onChange={(e) => handleChange(e, index)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`product-${index}-price`}>Price</Label>
                      <Input
                        id={`product-${index}-price`}
                        name="price"
                        type="number"
                        step="0.01"
                        value={product.price}
                        placeholder="Enter price"
                        onChange={(e) => handleChange(e, index)}
                        onBlur={() => {
                          setTemplate(prev => {
                            const updatedProducts = [...prev.products];
                            updatedProducts[index].price = Math.max(0, updatedProducts[index].price); // Ensure price is not negative
                            return { ...prev, products: updatedProducts };
                          });
                        }}
                        className="mt-1"
                      />
                    </div>

                    {/* Dropdown for selecting discount type */}
                    <div className="col-span-2">
                      <Label htmlFor={`product-${index}-discountType`}>Discount Type</Label>
                      <select
                        id={`product-${index}-discountType`}
                        value={product.discountType}
                        onChange={(e) => handleDiscountTypeChange(e, index)}
                        className="mt-1 rounded-lg py-2 px-3 w-full"
                      >
                        <option value="none">No Discount</option>
                        <option value="discountCode">Discount with Promo Code</option>
                        <option value="relatedProduct">Discount with Purchase</option>
                      </select>
                    </div>

                    {/* Conditionally render discount fields */}
                    {product.discountType === 'discountCode' && (
                      <>
                        <div>
                          <Label htmlFor={`product-${index}-discount`}>Discount Percentage</Label>
                          <Input
                            id={`product-${index}-discount`}
                            name="discountPer"
                            type="number"
                            min="0"
                            max="100"
                            value={product.discountPer}
                            placeholder="Enter discount percentage"
                            onChange={(e) => handleChange(e, index)}
                            onBlur={() => {
                              setTemplate(prev => {
                                const updatedProducts = [...prev.products];
                                updatedProducts[index].discountPer = Math.min(100, Math.max(0, updatedProducts[index].discountPer)); // Ensure value is between 0 and 100
                                return { ...prev, products: updatedProducts };
                              });
                            }}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`product-${index}-promoCode`}>Promo Code</Label>
                          <Input
                            id={`product-${index}-promoCode`}
                            name="promoCode"
                            value={product.promoCode}
                            placeholder="Enter promo code"
                            onChange={(e) => handleChange(e, index)}
                            className="mt-1"
                          />
                        </div>
                      </>
                    )}

                    {product.discountType === 'relatedProduct' && (
                      <>
                        <div>
                          <Label htmlFor={`product-${index}-discountAmt`}>Discount Amount</Label>
                          <Input
                            id={`product-${index}-discountAmt`}
                            name="discountAmt"
                            type="number"
                            min="0"
                            step="0.01"
                            value={product.discountAmt}
                            placeholder="Enter discount amount"
                            onChange={(e) => {
                              const value = Math.max(0, Math.min(e.target.value, product.price)); // Ensure it does not exceed the price
                              handleChange({ target: { name: 'discountAmt', value } }, index);
                            }}
                            onBlur={() => {
                              setTemplate(prev => {
                                const updatedProducts = [...prev.products];
                                // Ensure the discount amount does not exceed the price
                                updatedProducts[index].discountAmt = Math.min(updatedProducts[index].discountAmt, updatedProducts[index].price);
                                return { ...prev, products: updatedProducts };
                              });
                            }}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`product-${index}-relatedProduct`}>Related Product</Label>
                          <Input
                            id={`product-${index}-relatedProduct`}
                            name="relatedProduct"
                            value={product.relatedProduct}
                            placeholder="Enter related product"
                            onChange={(e) => handleChange(e, index)}
                            className="mt-1"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}

              <div className="mt-8">
                <Label htmlFor="preview">Preview</Label>
                <Textarea
                  ref={textAreaRef}
                  id="preview"
                  className="mt-1 h-64"
                  value={`Dear ${emailType === 'personalized'
                      ? template.customerName
                      : `${tierDisplayNames[template.customerTier || ""] || "Unknown"} Customers`
                    },

${template.introduction}

${template.image ? '[Image Preview: Embedded Image Below]' : '[No Image Provided]'}


Personalized Product Recommendations:
Top Picks for You:
${template.products.map((product, index) => {
                      let productDetails = `${index + 1}. ${product.productName}\n   o Price: $${product.price}`;

                      if (product.discountType === 'discountCode' && product.discountPer && product.promoCode) {
                        productDetails += `\n   o Discount: ${product.discountPer}% off with code: ${product.promoCode}`;
                      }

                      if (product.discountType === 'relatedProduct' && product.discountAmt && product.relatedProduct) {
                        productDetails += `\n   o Discount: Save $${product.discountAmt} when you buy with ${product.relatedProduct}`;
                      }

                      return productDetails;
                    }).join('\n\n')}

${template.conclusion}

Warm regards,
Marketing team`}
                  readOnly
                />
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <Button onClick={handleSave} className="bg-gray-700 hover:bg-gray-500 flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  Save Template
                </Button>
                <Button onClick={handleCopy} className="bg-gray-700 hover:bg-gray-500 flex items-center">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
                {session.account.role !== 'Admin' && (
                  <Button onClick={handleSend} className="bg-gray-700 hover:bg-gray-500 flex items-center">
                    <Send className="w-4 h-4 mr-2" />
                    Send Newsletter
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
