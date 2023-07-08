import React, { useEffect, useState } from 'react';
import ApexCharts from 'apexcharts';
import {
	HomeIcon,
} from '@heroicons/react/24/outline'
import axios from 'axios';
import { useParams, useNavigate } from 'react-router';

export default function Chart() {
	const companyTicker = useParams().ticker.toUpperCase()
	const navigate = useNavigate();
	const [financialData, setFinancialData] = useState([])

	function handleFinancialData(financialData) {
		const filteredData = financialData.map(attr => ({
			x: new Date(attr.attribute.date),
			y: [
				parseFloat(attr.attribute.open.toFixed(3)),
				parseFloat(attr.attribute.high.toFixed(3)),
				parseFloat(attr.attribute.low.toFixed(3)),
				parseFloat(attr.attribute.close.toFixed(3))
			]
		}));
		setFinancialData(filteredData);
	}

	function searchForOHLC() {
		let now = new Date();
		let day = now.getUTCDate().toString().padStart(2, '0');
		let month = (now.getUTCMonth() + 1).toString().padStart(2, '0'); // January is 0
		let year = (now.getUTCFullYear() - 1).toString();
		let date = `${day}/${month}/${year}`;

		const data = {
			company_ticker: companyTicker,
			start_date: date
		};

		let config = {
			method: 'post',
			url: '/F12A_ZULU/fetch',
			headers: {
				'Authorization': localStorage.getItem('token'),
				'Content-Type': 'application/json',
			},
			data: data
		};

		axios.request(config)
			.then((response) => {
				handleFinancialData(response.data.events)
			})
			.catch((error) => {
				console.log(error);
			});
	}

	const [newsData, setNewsData] = useState([])

	function standariseDate(date) {
		const year = date.slice(0, 4);
		const month = parseInt(date.slice(4, 6)) - 1; // Month is 0-indexed in Date()
		const day = date.slice(6, 8);
		const hour = date.slice(9, 11);
		const minute = date.slice(11, 13);
		const second = date.slice(13, 15);
		const formattedDate = `${day}/${month}/${year} ${hour}:${minute}:${second}`;
		return formattedDate
	}

	function handleNewsData(newsData) {
		const relevantNewsData = newsData.filter(item => {
			const relevantTicker = item.ticker_sentiment.find(ticker => ticker.ticker === companyTicker);
			return relevantTicker && parseFloat(relevantTicker.relevance_score) > 0.4;
		});
		const filteredData = relevantNewsData.map(obj => {
			const { title, url, time_published } = obj;
			const date = standariseDate(time_published);
			return { title, url, date };
		});
		setNewsData(filteredData)
		// console.log("Updated Articles")
	}

	function searchForArticles(formattedDate) {
		let url = 'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=' + companyTicker + '&topics&time_from=' + formattedDate + 'T0000&time_to=' + formattedDate + 'T2359&sort=EARLIEST&limit=10&apikey=GFNMSHC3YA6SH510';
		let config = {
			method: 'get',
			maxBodyLength: Infinity,
			url: url,
			headers: {},
			data: ''
		};

		axios.request(config)
			.then((response) => {
				console.log('searched for news')
				handleNewsData(response.data.feed)
			})
			.catch((error) => {
				console.log(error);
			});
	}

	useEffect(() => {
		searchForOHLC()
		// eslint-disable-next-line
	}, [companyTicker])

	useEffect(() => {
		const data = financialData
		const chartOptions = {
			chart: {
				type: 'candlestick',
				height: 500,
				events: {
					dataPointSelection: function (event, chartContext, config) {
						const dataPointIndex = config.dataPointIndex;
						const dateObj = financialData[dataPointIndex].x;
						const year = dateObj.getFullYear();
						const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
						const day = ('0' + dateObj.getDate()).slice(-2);
						const formattedDate = `${year}${month}${day}`;
						searchForArticles(formattedDate)
					},
				},
			},
			series: [
				{
					name: 'OHLC',
					type: 'candlestick',
					data: data
				}],
			title: {
				text: companyTicker + ' Financial News Chart',
				align: 'left'
			},
			stroke: {
				width: [1, 1]
			},
			tooltip: {
				shared: true,
				custom: [function ({ seriesIndex, dataPointIndex, w }) {
					return w.globals.series[seriesIndex][dataPointIndex]
				}, function ({ seriesIndex, dataPointIndex, w }) {
					var o = w.globals.seriesCandleO[seriesIndex][dataPointIndex]
					var h = w.globals.seriesCandleH[seriesIndex][dataPointIndex]
					var l = w.globals.seriesCandleL[seriesIndex][dataPointIndex]
					var c = w.globals.seriesCandleC[seriesIndex][dataPointIndex]
					return (
						`Open: ${o}<br>High: ${h}<br>Low: ${l}<br>Close: ${c}`
					)
				}]
			},
			xaxis: {
				type: 'datetime'
			}
		};

		const chart = new ApexCharts(document.querySelector('#candlestick-chart'), chartOptions);
		chart.render();

		// cleanup function to destroy chart instance when component unmounts
		return () => chart.destroy();
		// eslint-disable-next-line
	}, [financialData]);

	return (
		<div style={{ width: '60%', margin: '50px auto', padding: '20px', boxShadow: '0px 0px 10px rgba(0,0,0,0.5)' }}>
			<button className='espace-nowrap py-3.5 text-left text-sm font-semibold'
				onClick={() => navigate('/home')}><HomeIcon className='inline-block w-5 h-5 mr-1 -mt-0.5' />
			</button>
			<div id="candlestick-chart" style={{ padding: '20px', border: '1px solid rgba(0,0,0,0.1)' }} />
			<div className="overflow-x-auto">
				{newsData.length > 0 &&
					<table className="w-full h-full">
						<thead>
							<tr>
								<th
									scope="col"
									className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
								>
									Date
								</th>
								<th
									scope="col"
									className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
								>
									Title
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 bg-white">
							{newsData.map((item) => (
								<tr key={item.date}>
									<td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">{item.date}</td>
									<td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900" style={{ wordWrap: 'break-word' }}>
										<a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				}
			</div>
		</div>
	);
}