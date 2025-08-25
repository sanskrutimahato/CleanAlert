// Store chart instances globally
let charts = [];

function createChart(ctx, type, data, options) {
  return new Chart(ctx, {
    type: type,
    data: data,
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          enabled: true,
          backgroundColor: '#1f2937',
          titleColor: '#facc15',
          bodyColor: '#ffffff',
          padding: 12,
          borderWidth: 1,
          borderColor: '#facc15',
          displayColors: true,
          callbacks: {
            label: function (tooltipItem) {
              return ` ${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
            }
          }
        },
        legend: {
          labels: {
            color: '#374151',
            font: { weight: 'bold' }
          }
        }
      },
      hover: {
        mode: 'nearest',
        intersect: true,
        animationDuration: 600
      },
      animation: {
        duration: 1500,
        easing: 'easeInOutQuart'
      }
    }
  });
}

// Chart configs
const chartConfigs = [
  {
    id: 'chart1',
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [{
        label: 'Waste Collected (tons)',
        data: [12, 19, 14, 20, 16],
        borderColor: 'green',
        backgroundColor: 'rgba(0,128,0,0.2)',
        fill: true,
        tension: 0.4
      }]
    }
  },
  {
    id: 'chart2',
    type: 'bar',
    data: {
      labels: ['Zone A', 'Zone B', 'Zone C', 'Zone D'],
      datasets: [{
        label: 'Complaints Resolved',
        data: [65, 59, 80, 81],
        backgroundColor: ['#2563eb', '#f97316', '#22c55e', '#e11d48']
      }]
    }
  },
  {
    id: 'chart3',
    type: 'pie',
    data: {
      labels: ['Plastic', 'Organic', 'E-Waste', 'Other'],
      datasets: [{
        label: 'Waste Type Distribution',
        data: [30, 45, 15, 10],
        backgroundColor: ['#f87171', '#34d399', '#60a5fa', '#facc15'],
        hoverOffset: 12
      }]
    }
  },
  {
    id: 'chart4',
    type: 'doughnut',
    data: {
      labels: ['On-Time Pickup', 'Delayed Pickup'],
      datasets: [{
        label: 'Pickup Performance',
        data: [75, 25],
        backgroundColor: ['#22c55e', '#ef4444'],
        hoverOffset: 14
      }]
    }
  }
];

// Initialize all charts with data = [0]
chartConfigs.forEach(cfg => {
  let ctx = document.getElementById(cfg.id).getContext('2d');

  // Clone data with zeros
  let emptyData = JSON.parse(JSON.stringify(cfg.data));
  emptyData.datasets.forEach(ds => ds.data = ds.data.map(() => 0));

  let chart = createChart(ctx, cfg.type, emptyData);
  chart.originalData = cfg.data; // save original
  charts.push(chart);
});

// Scroll animations with IntersectionObserver
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const chart = charts.find(c => c.canvas.id === entry.target.id);
    if (chart) {
      if (entry.isIntersecting) {
        // Animate to original data
        chart.data = JSON.parse(JSON.stringify(chart.originalData));
      } else {
        // Reset to empty when out of view
        chart.data.datasets.forEach(ds => ds.data = ds.data.map(() => 0));
      }
      chart.update();
    }
  });
}, { threshold: 0.4 });

// Attach observer to all canvases
charts.forEach(chart => observer.observe(chart.canvas));
