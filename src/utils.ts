import { CartItem, CustomerData } from './types';
import { DELIVERY_FEES, OPENING_HOUR, OPENING_MINUTE, CLOSING_HOUR, CLOSING_MINUTE } from './constants';

export const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const normalizeText = (text: string): string => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
};

export const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

export const getDeliveryFee = (bairro: string): number => {
  const normalized = normalizeText(bairro);
  return DELIVERY_FEES[normalized] || 0;
};

export const checkStoreOpen = (): boolean => {
  const now = new Date();
  const day = now.getDay(); // 0 = Domingo, 1 = Segunda, ... 6 = Sábado

  // Fechado na Segunda-feira (1)
  if (day === 1) {
    return false;
  }

  const hours = now.getHours();
  const minutes = now.getMinutes();

  const currentTimeInMinutes = hours * 60 + minutes;
  const openTimeInMinutes = OPENING_HOUR * 60 + OPENING_MINUTE;
  const closeTimeInMinutes = CLOSING_HOUR * 60 + CLOSING_MINUTE;

  return currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes;
};

export const generateWhatsAppMessage = (
  cart: CartItem[], 
  data: CustomerData, 
  subtotal: number, 
  fee: number, 
  total: number, 
  isStoreOpen: boolean
) => {
  
  const itemsList = cart.map(item => 
    `• ${item.name} x${item.quantity} — ${formatCurrency(item.price * item.quantity)}`
  ).join('\n');

  let tipoEntrega = data.deliveryType === 'delivery' ? 'Entrega (Delivery)' : 'Retirada no Balcão';
  
  let enderecoCompleto = '';
  if (data.deliveryType === 'delivery') {
    enderecoCompleto = `
Bairro: ${data.bairro}
Rua: ${data.rua}, Nº ${data.numero}
Complemento: ${data.complemento || 'Nenhum'}
Referência: ${data.referencia || 'Nenhuma'}`;
  } else {
    enderecoCompleto = 'O cliente irá retirar no balcão.';
  }

  const taxaTxt = fee > 0 ? formatCurrency(fee) : (data.deliveryType === 'delivery' ? 'R$0,00 (A CONFIRMAR)' : 'R$0,00');
  
  if (data.deliveryType === 'delivery' && fee === 0) {
    tipoEntrega += ' ⚠️ TAXA A CONFIRMAR';
  }

  let trocoTxt = '';
  if (data.paymentMethod === 'Dinheiro') {
    if (data.changeFor) {
       trocoTxt = `\nTroco para: R$${data.changeFor}`;
    } else {
       trocoTxt = `\nNão precisa de troco.`;
    }
  }

  let avisoFechado = '';
  if (!isStoreOpen) {
    avisoFechado = `\n\n⚠️ *ATENÇÃO: PEDIDO FORA DO HORÁRIO*\nEste pedido foi feito com a loja *FECHADA*.\nFuncionamento: Terça a Domingo, das ${OPENING_HOUR}:${OPENING_MINUTE}h às ${CLOSING_HOUR}:${CLOSING_MINUTE}h.\nSeu pedido será processado assim que a loja reabrir.`;
  }

  const message = `
📦 *Novo Pedido - Casa da Esfiha* 🍕${avisoFechado}
----------------------------------------
🍽️ *Itens selecionados:*
${itemsList}
----------------------------------------
👤 *Cliente:* ${data.name}
🚚 *Forma de entrega:* ${tipoEntrega}

🏡 *DETALHES DA ENTREGA:*
${enderecoCompleto}

💰 *DETALHES DO PAGAMENTO:*
Forma de Pagamento: ${data.paymentMethod}${trocoTxt}

💸 *VALORES:*
Subtotal: ${formatCurrency(subtotal)}
Taxa de Entrega: ${taxaTxt}
*Total Final:* ${formatCurrency(total)}

📝 *Observações:* ${data.observation || 'Nenhuma'}
----------------------------------------
*Obrigado pela preferência!*
`;

  return `https://api.whatsapp.com/send?phone=5573982067758&text=${encodeURIComponent(message.trim())}`;
};