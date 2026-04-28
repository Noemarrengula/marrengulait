import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const formatCurrency = (value: number, currency = 'MZN'): string => {
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('pt-MZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

interface ProductRow {
  name?: string;
  title?: string;
  brand?: string;
  price: number;
  stock: number;
  category?: string;
  is_active?: boolean;
}

interface OrderRow {
  customer_name?: string;
  customer_email?: string;
  total_amount?: number;
  status?: string;
  created_at?: string;
}

interface UserRow {
  email?: string;
  id?: string;
  created_at?: string;
}

interface AlertRow {
  user_id?: string;
  product_id?: string;
  target_price?: number;
  created_at?: string;
}

interface QuestionRow {
  question?: string;
  product_id?: string;
  created_at?: string;
}

export const exportProductsPDF = (products: ProductRow[], companyName = 'Marrengula-IT') => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.setTextColor(255, 49, 49);
  doc.text(companyName, 14, 20);
  
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Relatório de Produtos', 14, 30);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-MZ')}`, 14, 38);
  doc.text(`Total de Produtos: ${products.length}`, 14, 44);
  
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  doc.text(`Valor Total em Stock: ${formatCurrency(totalValue)}`, 14, 50);

  const tableData = products.map((p: ProductRow, index: number) => [
    (index + 1).toString(),
    (p.name || p.title || 'N/A').substring(0, 40),
    p.brand || '-',
    formatCurrency(p.price),
    p.stock.toString(),
    p.category || '-',
    p.is_active !== false ? 'Ativo' : 'Inativo',
  ]);

  autoTable(doc, {
    startY: 55,
    head: [['#', 'Produto', 'Marca', 'Preço', 'Stock', 'Categoria', 'Status']],
    body: tableData,
    headStyles: {
      fillColor: [255, 49, 49],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
  });

  doc.save(`produtos-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportOrdersPDF = (orders: OrderRow[], companyName = 'Marrengula-IT') => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.setTextColor(255, 49, 49);
  doc.text(companyName, 14, 20);
  
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Relatório de Pedidos', 14, 30);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-MZ')}`, 14, 38);
  doc.text(`Total de Pedidos: ${orders.length}`, 14, 44);

  const totalSales = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  doc.text(`Volume Total de Vendas: ${formatCurrency(totalSales)}`, 14, 50);

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  let yPos = 58;
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  Object.entries(statusCounts).forEach(([status, count]) => {
    doc.text(`${status}: ${count}`, 14, yPos);
    yPos += 6;
  });

  const tableData = orders.map((o: OrderRow, index: number) => [
    (index + 1).toString(),
    o.customer_name || 'N/A',
    o.customer_email || 'N/A',
    formatCurrency(o.total_amount || 0),
    o.status || 'pending',
    formatDate(o.created_at || ''),
  ]);

  autoTable(doc, {
    startY: yPos + 5,
    head: [['#', 'Cliente', 'Email', 'Total', 'Status', 'Data']],
    body: tableData,
    headStyles: {
      fillColor: [255, 49, 49],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
  });

  doc.save(`pedidos-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportUsersPDF = (users: UserRow[], companyName = 'Marrengula-IT') => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.setTextColor(255, 49, 49);
  doc.text(companyName, 14, 20);
  
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Relatório de Utilizadores', 14, 30);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-MZ')}`, 14, 38);
  doc.text(`Total de Utilizadores: ${users.length}`, 14, 44);

  const tableData = users.map((u: UserRow, index: number) => [
    (index + 1).toString(),
    u.email || 'N/A',
    formatDate(u.created_at || ''),
    u.id?.substring(0, 8) || '-',
  ]);

  autoTable(doc, {
    startY: 50,
    head: [['#', 'Email', 'Data de Registo', 'ID']],
    body: tableData,
    headStyles: {
      fillColor: [255, 49, 49],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
  });

  doc.save(`utilizadores-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportSalesSummaryPDF = (
  orders: OrderRow[],
  products: ProductRow[],
  users: UserRow[],
  companyName = 'Marrengula-IT'
) => {
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.setTextColor(255, 49, 49);
  doc.text(companyName, 14, 20);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Resumo de Vendas', 14, 30);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-MZ')}`, 14, 38);

  let yPos = 48;

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Estatísticas Gerais', 14, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);

  const totalSales = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const avgOrder = orders.length > 0 ? totalSales / orders.length : 0;
  const deliveredOrders = orders.filter((o: OrderRow) => o.status === 'delivered').length;
  const pendingOrders = orders.filter((o: OrderRow) => o.status === 'pending').length;

  const stats = [
    ['Total de Vendas', formatCurrency(totalSales)],
    ['Número de Pedidos', orders.length.toString()],
    ['Valor Médio por Pedido', formatCurrency(avgOrder)],
    ['Pedidos Entregues', deliveredOrders.toString()],
    ['Pedidos Pendentes', pendingOrders.toString()],
    ['Total de Produtos', products.length.toString()],
    ['Total de Utilizadores', users.length.toString()],
    ['Valor em Stock', formatCurrency(products.reduce((sum, p: ProductRow) => sum + (p.price * p.stock), 0))],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [['Métrica', 'Valor']],
    body: stats,
    headStyles: {
      fillColor: [255, 49, 49],
      textColor: 255,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
    },
  });

  const jsPDFInstance = doc as jsPDF & { lastAutoTable?: { finalY: number } };
  const finalY = jsPDFInstance.lastAutoTable?.finalY + 15 || 80;
  
  if (finalY > 250) {
    doc.addPage();
  }

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Vendas por Status', 14, finalY);

  const statusCounts = orders.reduce((acc, o) => {
    const status = o.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.entries(statusCounts).map(([status, count]) => [
    status,
    count.toString(),
    formatCurrency(orders.filter((o: OrderRow) => o.status === status).reduce((sum, o) => sum + (o.total_amount || 0), 0)),
  ]);

  autoTable(doc, {
    startY: finalY + 5,
    head: [['Status', 'Quantidade', 'Valor Total']],
    body: statusData,
    headStyles: {
      fillColor: [255, 49, 49],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  doc.save(`resumo-vendas-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportAlertsPDF = (alerts: AlertRow[], questions: QuestionRow[], companyName = 'Marrengula-IT') => {
  const doc = new jsPDF();
  const jsPDFInstance = doc as jsPDF & { lastAutoTable?: { finalY: number } };
  
  doc.setFontSize(20);
  doc.setTextColor(255, 49, 49);
  doc.text(companyName, 14, 20);
  
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Relatório de Alertas e Perguntas', 14, 30);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-MZ')}`, 14, 38);
  doc.text(`Total de Alertas: ${alerts.length} | Total de Perguntas: ${questions.length}`, 14, 44);

  let yPos = 50;

  if (alerts.length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Alertas de Preço', 14, yPos);
    yPos += 5;

    const alertData = alerts.slice(0, 50).map((a: AlertRow, index: number) => [
      (index + 1).toString(),
      a.user_id?.substring(0, 8) || '-',
      a.product_id?.substring(0, 8) || '-',
      a.target_price ? formatCurrency(a.target_price) : '-',
      formatDate(a.created_at || new Date()),
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['#', 'Utilizador', 'Produto', 'Preço Alvo', 'Data']],
      body: alertData,
      headStyles: {
        fillColor: [255, 49, 49],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      styles: { fontSize: 8, cellPadding: 2 },
    });

    yPos = jsPDFInstance.lastAutoTable?.finalY + 15 || yPos + 15;
  }

  if (questions.length > 0 && yPos < 200) {
    if (yPos > 150) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Perguntas de Produtos', 14, yPos);
    yPos += 5;

    const questionData = questions.slice(0, 50).map((q: QuestionRow, index: number) => [
      (index + 1).toString(),
      (q.question || 'N/A').substring(0, 50),
      q.product_id?.substring(0, 8) || '-',
      formatDate(q.created_at || new Date()),
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['#', 'Pergunta', 'Produto', 'Data']],
      body: questionData,
      headStyles: {
        fillColor: [255, 49, 49],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      styles: { fontSize: 8, cellPadding: 2 },
    });
  }

  doc.save(`alertas-perguntas-${new Date().toISOString().split('T')[0]}.pdf`);
};
