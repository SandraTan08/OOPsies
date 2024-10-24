-- Create the newsletter table if it doesn't exist
CREATE TABLE IF NOT EXISTS newsletter (
    newsletterId BIGINT AUTO_INCREMENT PRIMARY KEY,
    templateName VARCHAR(255) NOT NULL,
    accountId VARCHAR(255) NOT NULL,
    customerName VARCHAR(255) NOT NULL
);

-- Create the newsletter_products table if it doesn't exist
CREATE TABLE IF NOT EXISTS newsletter_products (
    templateId BIGINT AUTO_INCREMENT PRIMARY KEY,
    productName VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    discountType VARCHAR(255),
    promoCode VARCHAR(255),
    discountPer DECIMAL(5, 2),
    discountAmt DECIMAL(10, 2),
    relatedProduct VARCHAR(255),
    newsletterId BIGINT NOT NULL,
    FOREIGN KEY (newsletterId) REFERENCES newsletter(newsletterId) ON DELETE CASCADE
);
