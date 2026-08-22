# Smart Shopper

Build a mobile-first shopping price comparison web app.

The purpose of the app is to help shoppers compare the price of the same or similar products at different retailers so they can decide where to shop and save money.

For the first prototype, focus on Walmart and Target.

Main Features

Product Search

Create a search bar on the home screen where a user can search for an item, such as:

Tide laundry detergent

Coca-Cola 12 pack

Bounty paper towels

Dove body wash

Price Comparison Results

After the user searches, display matching products from Walmart and Target side-by-side.

Each result should show:

Product image

Product name

Brand

Retailer

Package size or quantity

Current price

Price per unit when possible

Whether the product is on sale

A button to view the product at the retailer

Highlight the cheapest option.

AI Shopping Assistant

Add an AI assistant section that can eventually analyze the results and provide recommendations such as:

“Target has the lowest price for this exact product.”

“Walmart’s larger package costs more upfront but is cheaper per ounce.”

“Consider this store-brand alternative to save $2.50.”

For the prototype, use sample data for these recommendations rather than connecting an AI model yet.

Shopping List

Allow users to add multiple products to a shopping list.

Create a comparison screen showing:

Estimated Walmart total

Estimated Target total

Cheapest store overall

Estimated savings

Which individual products are cheaper at each store

Eventually the app should be able to recommend splitting the shopping trip between retailers when the savings are significant.

Price Alerts

Create a prototype feature where users can select a product and choose “Track Price.”

Create a page showing tracked products and their current prices.

Design

Make the app feel like a modern consumer shopping application.

Use a clean, simple interface designed primarily for smartphones.

Do not copy Walmart’s or Target’s website designs.

Create these pages:

Home/Search

Search Results

Product Comparison

Shopping List

Price Tracker

User Profile

Use realistic SAMPLE product data for now.

IMPORTANT: Do not scrape Walmart or Target websites or attempt to build unofficial retailer integrations yet. Build the user interface and application functionality using mock data first. Structure the project so real product-price APIs can be connected later.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/157fa449-3531-48a1-b30a-c0c855c46a38).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
