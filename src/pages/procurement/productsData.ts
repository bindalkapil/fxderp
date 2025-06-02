// This is a mock product and SKU data source for dropdowns
export interface ProductSKU {
  name: string;
  skus: string[]; // sizes
}

export interface ProductCategory {
  category: string;
  products: ProductSKU[];
}

export const productCategories: ProductCategory[] = [
  {
    category: 'Pomegranate',
    products: [
      { name: 'POMO-MH', skus: ['A3', 'A2', 'A1', 'SPL', 'S', 'SS', 'SSS', 'SB1', 'SB2', 'Loose'] },
      { name: 'POMO-GJ', skus: ['A3', 'A2', 'A1', 'SPL', 'S', 'Loose'] },
      { name: 'POMO-RJ', skus: ['A3', 'A2', 'A1', 'S', 'Loose'] },
      { name: 'POMO-KA', skus: ['A3', 'A2', 'A1', 'SB1', 'SB2', 'Loose'] },
    ]
  },
  {
    category: 'Mango',
    products: [
      { name: 'MNG-ALPH', skus: ['20 Dana', '30 Dana', '40 Dana', 'Loose'] },
      { name: 'MNG-KESAR', skus: ['20 Dana', '30 Dana', '50 Dana', 'Loose'] },
      { name: 'MNG-DASH', skus: ['20 Dana', '30 Dana', '40 Dana', '50 Dana', 'Loose'] },
    ]
  },
  {
    category: 'Apple',
    products: [
      { name: 'Apple-CA', skus: ['Grade A', 'Grade B', 'Grade C', 'Premium', 'Loose'] },
      { name: 'Apple-Turkey', skus: ['Grade A', 'Grade B', 'Premium', 'Loose'] },
      { name: 'Apple-Kashmir', skus: ['Grade A', 'Grade B', 'Grade C', 'Loose'] },
    ]
  },
  {
    category: 'Banana',
    products: [
      { name: 'BAN-CAVL', skus: ['Hands', 'Bunch', '12 Count', '24 Count', 'Loose'] },
      { name: 'BAN-ROB', skus: ['Hands', 'Bunch', 'Loose'] },
      { name: 'BAN-NEND', skus: ['12 Count', '24 Count', 'Loose'] },
    ]
  },
  {
    category: 'Orange',
    products: [
      { name: 'ORG-NAVL', skus: ['70 Count', '60 Count', '80 Count', 'Premium', 'Loose'] },
      { name: 'ORG-BLD', skus: ['70 Count', '60 Count', 'Loose'] },
      { name: 'ORG-MAND', skus: ['80 Count', 'Premium', 'Loose'] },
    ]
  },
];
