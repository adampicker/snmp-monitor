export const chartOptions = {
  title: {
    text: 'SOME TITLE'
  },
  tooltip: {
    trigger: 'axis',
    formatter: params => {
      params = params[0];
      const date = new Date(params.name);
      return (
        date.getDate() +
        '/' +
        (date.getMonth() + 1) +
        '/' +
        date.getFullYear() +
        ' ' +
        date.getHours() +
        ':' +
        date.getMinutes() +
        ':' +
        date.getSeconds() +
        ' : ' +
        params.value[1]
      );
    },
    axisPointer: {
      animation: false
    }
  },
  xAxis: {
    type: 'time',
    splitLine: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    boundaryGap: ['20%', '20%'],
    splitLine: {
      show: false
    },
    scale: true
  },
  series: [
    {
      name: 'Mocking Data',
      type: 'line',
      showSymbol: false,
      hoverAnimation: false,
      data: []
    }
  ]
};
