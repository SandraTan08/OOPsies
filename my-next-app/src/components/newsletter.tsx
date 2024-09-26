'use client'

import { useState } from 'react'
import { Save, Copy, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function Newsletter() {
  const [template, setTemplate] = useState({
    customerName: '[Customer Name]',
    product1: {
      name: '[Product Name 1]',
      price: '[Product Price]',
      discount: '[Discount Percentage]',
      promoCode: '[Promo Code]'
    },
    product2: {
      name: '[Product Name 2]',
      price: '[Product Price]'
    },
    product3: {
      name: '[Product Name 3]',
      price: '[Product Price]',
      discountAmount: '[Discount Amount]',
      relatedProduct: '[Related Product]'
    }
  })

  const handleChange = (e, product = null) => {
    const { name, value } = e.target
    if (product) {
      setTemplate(prev => ({
        ...prev,
        [product]: { ...prev[product], [name]: value }
      }))
    } else {
      setTemplate(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSave = () => {
    // Implement save functionality
    console.log('Saving template:', template)
  }

  const handleCopy = () => {
    // Implement copy functionality
    console.log('Copying template')
  }

  const handleSend = () => {
    // Implement send functionality
    console.log('Sending newsletter')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
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
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          {['product1', 'product2', 'product3'].map((product, index) => (
            <div key={product} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Product {index + 1}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`${product}-name`}>Product Name</Label>
                  <Input
                    id={`${product}-name`}
                    name="name"
                    value={template[product].name}
                    onChange={(e) => handleChange(e, product)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`${product}-price`}>Price</Label>
                  <Input
                    id={`${product}-price`}
                    name="price"
                    value={template[product].price}
                    onChange={(e) => handleChange(e, product)}
                    className="mt-1"
                  />
                </div>
                {product === 'product1' && (
                  <>
                    <div>
                      <Label htmlFor={`${product}-discount`}>Discount</Label>
                      <Input
                        id={`${product}-discount`}
                        name="discount"
                        value={template[product].discount}
                        onChange={(e) => handleChange(e, product)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${product}-promoCode`}>Promo Code</Label>
                      <Input
                        id={`${product}-promoCode`}
                        name="promoCode"
                        value={template[product].promoCode}
                        onChange={(e) => handleChange(e, product)}
                        className="mt-1"
                      />
                    </div>
                  </>
                )}
                {product === 'product3' && (
                  <>
                    <div>
                      <Label htmlFor={`${product}-discountAmount`}>Discount Amount</Label>
                      <Input
                        id={`${product}-discountAmount`}
                        name="discountAmount"
                        value={template[product].discountAmount}
                        onChange={(e) => handleChange(e, product)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${product}-relatedProduct`}>Related Product</Label>
                      <Input
                        id={`${product}-relatedProduct`}
                        name="relatedProduct"
                        value={template[product].relatedProduct}
                        onChange={(e) => handleChange(e, product)}
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
              id="preview"
              className="mt-1 h-64"
              value={`Dear ${template.customerName},

We've curated something special for you! Based on your recent purchases and browsing history, here are some exclusive offers and recommendations we think you'll love.

Personalized Product Recommendations:
Top Picks for You:
1. ${template.product1.name}
   o Price: $${template.product1.price}
   o Discount: ${template.product1.discount}% off with code ${template.product1.promoCode}
2. ${template.product2.name}
   o Price: $${template.product2.price}
   o Discount: Buy one, get one Free
3. ${template.product3.name}
   o Price: $${template.product3.price}
   o Discount: Save ${template.product3.discountAmount} when you buy with ${template.product3.relatedProduct}

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