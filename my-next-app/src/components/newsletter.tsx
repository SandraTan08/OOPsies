'use client'

import { useState, useRef } from 'react'
import { Save, Copy, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function Newsletter() {
  const [template, setTemplate] = useState({
    customerName: '[Customer Name]',
    products: [] // Changed to an array to store products dynamically
  })

  const [numProducts, setNumProducts] = useState(1); // New state for number of products
  const textAreaRef = useRef(null); // Reference for the textarea

  // Initialize products based on numProducts
  const handleNumProductsChange = (e) => {
    const count = Math.max(1, Math.min(10, e.target.value)); // Limit to a range
    setNumProducts(count);

    // Update products array based on new count
    setTemplate(prev => {
      const updatedProducts = Array.from({ length: count }, (_, index) => ({
        name: `[Product Name ${index + 1}]`,
        price: '[Product Price]',
        discountType: 'none', // New field to track discount type
        discount: '[Discount Percentage]', // Discount percentage or amount
        promoCode: '[Promo Code]', // Promo code for discount type 1
        relatedProduct: '[Related Product]', // Related product for discount type 2
      }));
      return { ...prev, products: updatedProducts };
    });
  };

  const handleChange = (e, productIndex) => {
    const { name, value } = e.target;

    setTemplate(prev => {
      const updatedProducts = [...prev.products];
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        [name]: value
      };
      return { ...prev, products: updatedProducts };
    });
  }

  const handleSave = async () => {
    console.log('Saving template');
    try {
        const response = await fetch('http://localhost:8080/api/v1/newsletter/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(template), // Convert the template object to JSON
        });

        if (!response.ok) {
            // Handle non-2xx responses
            const errorMessage = await response.text();
            alert(`Error saving template: ${errorMessage}`);
            return;
        }

        // Handle successful response
        const message = await response.text();
        alert(message); // Display success message

        // Optionally reset the form or do other actions here
    } catch (error) {
        console.error("Error saving template:", error);
        alert("An error occurred while saving the template.");
    }
};

  const handleCopy = () => {
    console.log('Copying template');
    if (textAreaRef.current) {
      navigator.clipboard.writeText(textAreaRef.current.value)
        .then(() => {
          alert("Copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  }

  const handleSend = () => {
    console.log('Sending newsletter');
  }

  const handleDiscountTypeChange = (e, index) => {
    const { value } = e.target;
    setTemplate(prev => {
      const updatedProducts = [...prev.products];
      updatedProducts[index].discountType = value; // Set discount type for the product
      return { ...prev, products: updatedProducts };
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-100 border-b">
          <h1 className="text-2xl font-semibold text-gray-800">Personalized Newsletter</h1>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              name="customerName"
              value={template.customerName}
              onChange={(e) => setTemplate({ ...template, customerName: e.target.value })}
              className="mt-1"
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="numProducts">Number of Products</Label>
            <Input
              id="numProducts"
              type="number"
              min="1"
              max="10"
              value={numProducts}
              onChange={handleNumProductsChange}
              className="mt-1"
            />
          </div>

          {template.products.map((product, index) => (
            <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Product {index + 1}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`product-${index}-name`}>Product Name</Label>
                  <Input
                    id={`product-${index}-name`}
                    name="name"
                    value={product.name}
                    onChange={(e) => handleChange(e, index)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`product-${index}-price`}>Price</Label>
                  <Input
                    id={`product-${index}-price`}
                    name="price"
                    value={product.price}
                    onChange={(e) => handleChange(e, index)}
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
                        name="discount"
                        value={product.discount}
                        onChange={(e) => handleChange(e, index)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`product-${index}-promoCode`}>Promo Code</Label>
                      <Input
                        id={`product-${index}-promoCode`}
                        name="promoCode"
                        value={product.promoCode}
                        onChange={(e) => handleChange(e, index)}
                        className="mt-1"
                      />
                    </div>
                  </>
                )}

                {product.discountType === 'relatedProduct' && (
                  <>
                    <div>
                      <Label htmlFor={`product-${index}-discountAmount`}>Discount Amount</Label>
                      <Input
                        id={`product-${index}-discountAmount`}
                        name="discount"
                        value={product.discount}
                        onChange={(e) => handleChange(e, index)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`product-${index}-relatedProduct`}>Related Product</Label>
                      <Input
                        id={`product-${index}-relatedProduct`}
                        name="relatedProduct"
                        value={product.relatedProduct}
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
              value={`Dear ${template.customerName},

We've curated something special for you! Based on your recent purchases and browsing history, here are some exclusive offers and recommendations we think you'll love.

Personalized Product Recommendations:
Top Picks for You:
${template.products.map((product, index) => {
                let productDetails = `${index + 1}. ${product.name}\n   o Price: $${product.price}`;

                if (product.discountType === 'discountCode' && product.discount && product.promoCode) {
                  productDetails += `\n   o Discount: ${product.discount}% off with code ${product.promoCode}`;
                }

                if (product.discountType === 'relatedProduct' && product.discount && product.relatedProduct) {
                  productDetails += `\n   o Discount: Save $${product.discount} when you buy with ${product.relatedProduct}`;
                }

                return productDetails;
              }).join('\n\n')}

Take advantage of these personalized offers and discover more with Timperio. Shop now and enjoy the best deals tailored just for you!

Warm regards,
Marketing team`}
              readOnly
            />
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <Button onClick={handleSave} className="flex items-center">
              <Save className="w-4 h-4 mr-2" />
              Save Template
            </Button>
            <Button onClick={handleCopy} variant="outline" className="flex items-center">
              <Copy className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </Button>
            <Button onClick={handleSend} className="flex items-center">
              <Send className="w-4 h-4 mr-2" />
              Send Newsletter
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
