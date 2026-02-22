import { Category, Product, DeliveryFeeMap } from './types';


export const MANAGER_CREDENTIALS = {
  username: 'admin',
  password: '123456' 
};
// so botei senha aqui pq como não afeta em dinheiro ou algo do tipo não fiz algo mais profissionalkk preguiça msm

export const OPENING_HOUR = 17;
export const OPENING_MINUTE = 30;
export const CLOSING_HOUR = 22;
export const CLOSING_MINUTE = 30;

export const MENU_ITEMS: Product[] = [
  // Tradicionais
  { id: 't1', name: 'Carne', price: 6.00, category: Category.TRADICIONAL, available: true },
  { id: 't2', name: 'Carne com queijo', price: 7.00, category: Category.TRADICIONAL, available: true },
  { id: 't3', name: 'Carne com bacon', price: 10.00, category: Category.TRADICIONAL, available: true },
  { id: 't4', name: 'Queijo', price: 7.00, category: Category.TRADICIONAL, available: true },
  { id: 't5', name: 'Queijo com milho', price: 8.00, category: Category.TRADICIONAL, available: true },
  { id: 't6', name: 'Calabresa', price: 7.00, category: Category.TRADICIONAL, available: true },
  { id: 't7', name: 'Calabresa com queijo', price: 8.00, category: Category.TRADICIONAL, available: true },
  { id: 't8', name: 'Frango', price: 7.00, category: Category.TRADICIONAL, available: true },
  { id: 't9', name: 'Frango com catupiry', price: 8.00, category: Category.TRADICIONAL, available: true },
  { id: 't10', name: 'Mista', price: 8.00, category: Category.TRADICIONAL, available: true },

  // Premium
  { id: 'p1', name: 'Carne seca com banana e queijo', price: 10.00, category: Category.PREMIUM, available: true },
  { id: 'p2', name: 'Atum com queijo', price: 9.00, category: Category.PREMIUM, available: true },
  { id: 'p3', name: 'Bacon', price: 9.00, category: Category.PREMIUM, available: true },
  { id: 'p4', name: 'Salaminho', price: 9.00, category: Category.PREMIUM, available: true },
  { id: 'p5', name: 'Palmito', price: 10.00, category: Category.PREMIUM, available: true },
  { id: 'p7', name: 'Tomate seco', price: 9.00, category: Category.PREMIUM, available: true },

  // Doces
  { id: 'd1', name: 'Romeu e Julieta', price: 9.00, category: Category.DOCE, available: true },
  { id: 'd2', name: 'Chocolate com granulado', price: 9.00, category: Category.DOCE, available: true },
  { id: 'd3', name: 'Doce de leite', price: 9.00, category: Category.DOCE, available: true },
  { id: 'd4', name: 'Chocolate com M&M', price: 10.00, category: Category.DOCE, available: true },
  { id: 'd5', name: 'Nutella', price: 10.00, category: Category.DOCE, available: true },
  { id: 'd6', name: 'Bueno', price: 10.00, category: Category.DOCE, available: true },
  { id: 'd7', name: 'Pistache', price: 10.00, category: Category.DOCE, available: true },
  { id: 'd8', name: 'Ninho', price: 10.00, category: Category.DOCE, available: true },

  // Bebidas
  { id: 'b1', name: 'Refrigerante lata 350ml', price: 6.00, category: Category.BEBIDAS, available: true },
  { id: 'b2', name: 'Refrigerante 1 litro', price: 10.00, category: Category.BEBIDAS, available: true },
];

export const DELIVERY_FEES: DeliveryFeeMap = {
  // R$8 (Centro / Próximos)
  "centro": 8,
  "centro comercial": 8,
  "goes calmon": 8,
  "zildolandia": 8,
  "pontalzinho": 8,
  "castalia": 8,
  "conceicao": 8,
  "nossa senhora da conceicao": 8,

  // R$10 (Distância média) 
  "banco raso": 10,
  "santo antonio": 10,
  "mangabinha": 10,
  "sarinha alcantara": 10,
  "jardim primavera": 10,
  "jardim grapiuna": 10,
  "fonseca": 10,
  "nova itabuna": 10,
  "sao caetano": 10,
  "vila das dores": 10,
  "fernando gomes": 10,
  "ipiranga": 10,
  "nossa senhora das gracas": 10,

  // R$12 (Mais afastados)
  "california": 12,
  "nova california": 12,
  "fatima": 12,
  "joao soares": 12,
  "pedro geronimo": 12,
  "daniel gomes": 12,
  "maria pinheiro": 12,
  "monte cristo": 12,
  "lomanto junior": 12,
  "jorge amado": 12,
  "sao judas tadeu": 12,
  "sao pedro": 12,
  "sao roque": 12,
  "novo sao caetano": 12,
  "taveirolandia": 12,
  "parque santa clara": 12,
  "parque verde": 12,
  "novo horizonte": 12,
  "paraíso": 12,

  // R$15 (Distantes / Extremidades) 
  "ferradas": 15,
  "nova ferradas": 15,
  "manoel leao": 15,
  "parque boa vista": 15,
  "santa ines": 15,
  "sinval palmeira": 15,
  "urbis iv": 15,
  "area rural de itabuna": 15
};
