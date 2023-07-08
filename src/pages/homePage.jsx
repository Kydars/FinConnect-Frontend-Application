/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/

import {
  useNavigate
} from 'react-router-dom';
import axios from 'axios';
import ZuluService from '../zuluService'
import { Fragment, useEffect, useState } from 'react'
import moment from 'moment';
import { Menu, Transition } from '@headlessui/react'
import {
  // Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  FingerPrintIcon,
  FolderIcon,
  HomeIcon,
  NewspaperIcon,
  UsersIcon,
  // XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
// import { CheckCircleIcon, ChevronRightIcon, EnvelopeIcon } from '@heroicons/react/20/solid'
import { LinkIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function HomePage() {
  //navigationBar data
  const [navigation, setNavigation] = useState([
    { name: 'Overview', href: '#', icon: HomeIcon, current: true, id: 'overview-button'  },
    { name: 'Company Search', href: '#', icon: UsersIcon, current: false, id: 'company-button' },
    { name: 'News Search', href: '#', icon: FolderIcon, current: false, id: 'news-button' },
    { name: 'Predict Price', href: '#', icon: CalendarIcon, current: false, id: 'predict-button' },
  ])

  const teams = [
    { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false },
    { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
    { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
  ]
  const userNavigation = [
    { name: 'Your profile', href: '#', id: 'your-profile-button' },
    { name: 'Sign out', href: '#', id: 'sign-out-button'},
  ]

  //const forceUpdate = React.useCallback(() => updateState({}), []);

  const topCompanyCode = [
    "AAPL",
    "MSFT",
    "2222.SR",
    "GOOG",
    "AMZN",
    "BRK-B",
    "NVDA",
    "TSLA",
    "META",
    "JNJ",
  ]
  // content show flag
  const [showOverview, setShowOverview] = useState(true)
  const [showCompanySearch, setShowCompanySearch] = useState(false)
  const [showNewsSearch, setShowNewsSearch] = useState(false)
  const [showPredictPrice, setShowPredictPrice] = useState(false)

  // Token is taken from localStorage
  const token = localStorage.getItem('token')
  console.log(token);

  //---------Overview------------

  const features = [
    {
      name: 'Company Search',
      description:
        'Search through the historical OHLC data of any publicly-traded company.',
      icon: MagnifyingGlassIcon,
    },
    {
      name: 'News Search',
      description:
        'Search through articles related to any company, based on their relevance.',
      icon: NewspaperIcon,
    },
    {
      name: 'Interactive Financial News Chart',
      description:
        'Aggregate Financial and News data and see how the global events impact the markets.',
      icon: ChartBarIcon,
    },
    {
      name: 'Advanced security',
      description:
        'Protect yourself with advanced security features, including end-to-end encryption.',
      icon: FingerPrintIcon,
    },
  ]

  //-----------------company Search-----------------
  // send this searchedCode to backend and then load corressponding data to companyData
  const [searchedCode, setSearchedCode] = useState("")
  const handleChangeSearchedCode = (event) => {
    setSearchedCode(event.target.value);
  };
  //static company Search data
  const [companyData,setCompanyData] = useState([
    {
      companyCode: '',
      companyName: '',
      open: '',
      high: '',
      low: '',
      close: '',
      daily_change: '',
      weekly_change: '',
      monthly_change: '', 
      otherData: []
    },
  ])

  //this for test
  // const [searchedCompanyData,setSearchedCompanyData] = useState({
  //   companyCode: '',
  //   companyName: '',
  //   open: '',
  //   high: '',
  //   low: '',
  //   close: '',
  //   daily_change: '',
  //   weekly_change: '',
  //   monthly_change: '', 
  //   otherData: []
  // })

  //-----------------company Search-----------------

  //-----------------News Search-----------------
  const [searchResults, setSearchResults] = useState([]);
  const [newsSearchedCode, setNewsSearchedCode] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showArticles, setShowArticles] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [articles, setArticles] = useState([]);

  const handleChangeNewsSearchedCode = (event) => {
    setNewsSearchedCode(event.target.value);
    var url = 'https://www.alphavantage.co/query';
    const params = {
      function: 'SYMBOL_SEARCH',
      keywords: event.target.value,
      apikey: '8JKI0C6L269Y25HW'
    }
    axios.get(url, {params: params}).then((response) => {
      setSearchResults(response.data.bestMatches);
    }).catch((error) => {
      console.log('Error', error);
    })
  };
  
  async function newsSearchCall (ticker, name) {
    let data = JSON.stringify({
      query: `{
        contentSearch(page:1, pageSize:50, q: {operation: AND, subQueries: [{term: "${name.split(" ")[0]}"}, {term: "stock"}]}, filters: {section: "technology"}, orderBy: newest, orderDate: published)
            {
                total
                currentPage
                pageSize
                totalPages
                results {
                    webPublicationDate
                    sectionId
                    sectionName
                    webUrl
                    webTitle
                }
            }
        }`,
      variables: {},
    });
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: '/H09A_FOXTROT/graphql',
      headers: { 
        'Authorization': 'Bearer ' + localStorage.getItem('token'), 
        'Content-Type': 'application/json'
      },
      data : data
    };
    axios.request(config)
    .then((response) => {
        const list = filterAndFormatList(response.data.data.contentSearch.results)
        setShowSpinner(false);
        setShowArticles(true);
        setArticles(list);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const filterAndFormatList = (list) => {
    const currentDate = new Date();
        const oneYearAgo = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
        const filteredList = list.filter(item => {
          const itemDate = new Date(item.webPublicationDate);
          return itemDate >= oneYearAgo && itemDate <= currentDate;
        });
        const formattedList = filteredList.map((item) => {
          const formattedDate = moment(item.webPublicationDate).format('MMM D, YYYY');
          return { ...item, webPublicationDate: formattedDate };
        });
        return formattedList;
  }
  //-----------------News Search-----------------

  //-----------------predict price-----------------

  //-----------------predict price-----------------
  // const param = useParams();
  const navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };

  function initCompanySearchList() {
    const token = localStorage.getItem("token")
    if (token == null) {
      routeChange("/")
    }
    else {
      let days = new Date()
      //date one week before
      let tarDay = days.getTime() - 1000 * 60 * 60 * 24 * 7
      days.setTime(tarDay)
      let year = days.getFullYear()
      let month = days.getMonth()+1
      if (month < 10) {
        month = "0" + month
      }
      let day = days.getDate()
      if (day < 10) {
        day = "0" + day
      }
      const dateQuery = day + "/" + month + "/" + year
      console.log(dateQuery)
      let arr = []
      for (let index = 0; index < topCompanyCode.length; index++) {
        const code = topCompanyCode[index];
        const para = {
          body : {
            company_ticker: code,
            start_date: dateQuery
          },
          header : {
            Authorization: token,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
          }
        }
        //console.log(para)
        ZuluService.initCompanyList(para)
        .then((res) => {
          let item = {
            companyCode: '',
            companyName: '',
            open: '',
            high: '',
            low: '',
            close: '',
            daily_change: '',
            weekly_change: '',
            monthly_change: '',            
            otherData: []
          }
          //console.log(res.data)
          item["companyCode"] = res.data.dataset_id
          let latestData = res.data.events[res.data.events.length -1]
          //console.log(latestData)
          item["open"] = latestData.attribute.open.toFixed(3)
          item["high"] = latestData.attribute.high.toFixed(3)         
          item["low"] = latestData.attribute.low.toFixed(3)
          item["close"] = latestData.attribute.close.toFixed(3)
          item["daily_change"] = latestData.attribute.daily_change.toFixed(3)
          item["weekly_change"] = latestData.attribute.weekly_change.toFixed(3)
          item["monthly_change"] = latestData.attribute.monthly_change.toFixed(3)
          //console.log(item)
          arr.push(item)
          setCompanyData([...arr])
          //console.log("set")
        })        
      }
    }
  }

  useEffect(()=>{
    initCompanySearchList();
    // eslint-disable-next-line    
  },[])


  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div>
        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=white"
                alt="Your Company"
              />
              <h1 className="ml-3 text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
                FinConnect
              </h1>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul id="navigation-list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name} id={item.id}>
                        {/* <a
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-indigo-700 text-white'
                              : 'text-indigo-200 hover:text-white hover:bg-indigo-700',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current ? 'text-white' : 'text-indigo-200 group-hover:text-white',
                              'h-6 w-6 shrink-0'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a> */}
                        <button
                          className={classNames(
                            item.current
                              ? 'bg-indigo-700 text-white'
                              : 'text-indigo-200 hover:text-white hover:bg-indigo-700',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                          onClick={() => {
                            const navi = [
                              { name: 'Overview', href: '#', icon: HomeIcon, current: true },
                              { name: 'Company Search', href: '#', icon: UsersIcon, current: false },
                              { name: 'News Search', href: '#', icon: FolderIcon, current: false },
                              { name: 'Predict Price', href: '#', icon: CalendarIcon, current: false },
                            ]
                            for (let index = 0; index < navi.length; index++) {
                              if (item.name === navi[index].name) {
                                navi[index].current = true
                              }
                              else {
                                navi[index].current = false
                              }
                            }
                            setNavigation(navi);
                            if (item.name === "Overview") {
                              setShowOverview(true)
                              setShowCompanySearch(false)
                              setShowNewsSearch(false)
                              setShowPredictPrice(false)
                            }
                            if (item.name === "Company Search") {
                              setShowOverview(false)
                              setShowCompanySearch(true)
                              setShowNewsSearch(false)
                              setShowPredictPrice(false)
                            }
                            if (item.name === "News Search") {
                              setShowOverview(false)
                              setShowCompanySearch(false)
                              setShowNewsSearch(true)
                              setShowPredictPrice(false)
                            }
                            if (item.name === "Predict Price") {
                              setShowOverview(false)
                              setShowCompanySearch(false)
                              setShowNewsSearch(false)
                              setShowPredictPrice(true)
                            }
                          }}
                        >
                          <item.icon
                            className={classNames(
                              item.current ? 'text-white' : 'text-indigo-200 group-hover:text-white',
                              'h-6 w-6 shrink-0'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="text-xs font-semibold leading-6 text-indigo-200">Your teams</div>
                  <ul className="-mx-2 mt-2 space-y-1">
                    {teams.map((team) => (
                      <li key={team.name}>
                        <a
                          href={team.href}
                          className={classNames(
                            team.current
                              ? 'bg-indigo-700 text-white'
                              : 'text-indigo-200 hover:text-white hover:bg-indigo-700',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
                            {team.initial}
                          </span>
                          <span className="truncate">{team.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="mt-auto">
                  <a
                    href="/home"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white"
                  >
                    <Cog6ToothIcon
                      className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
                      aria-hidden="true"
                    />
                    Settings
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            {/* Separator */}
            <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6"            >
              <div className="relative flex flex-1">

              </div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Separator */}
                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <Menu.Button id="profile-dropdown" className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full bg-gray-50"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                    <span className="hidden lg:flex lg:items-center">
                      <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                        Derek Cook
                      </span>
                      <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name} id={item.id}>
                          {({ active }) => (
                            <a href="./" data-testid={`menu-item-${item.name}`} className={classNames(active ? 'bg-gray-50' : '',
                                'block px-3 py-1 text-sm leading-6 text-gray-900'
                              )}
                              onClick={() => {localStorage.removeItem('token')}}
                            >
                              {item.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">
              {/* Your content */}


              <div className="overflow-hidden bg-white shadow sm:rounded-lg p-16"
                style={{ display: showOverview ? 'block' : 'none' }}
              >
                {/* Overview */}
                <div className="bg-white py-24 sm:py-8">
                  <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                      <h2 className="mt-1 text-base font-semibold leading-7 text-indigo-600">Smarter, Faster and Easier</h2>
                      <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Everything you need to understand the market
                      </p>
                      <p className="mt-6 text-lg leading-8 text-gray-600">
                        Connect the dots between global events and financial markets, and always stay up to date.
                      </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                      <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        {features.map((feature) => (
                          <div key={feature.name} className="relative pl-16">
                            <dt className="text-base font-semibold leading-7 text-gray-900">
                              <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                              </div>
                              {feature.name}
                            </dt>
                            <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden bg-white shadow sm:rounded-lg"
                style={{ display: showCompanySearch ? 'block' : 'none' }}
              >
                {/* Company Search */}
                <div className="px-4 py-5 sm:p-6">
                  <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Company Search</h1>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="relative flex items-center">
                    <MagnifyingGlassIcon
                      className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <input
                      id="company-search-field"
                      className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                      placeholder="Search company by company code"
                      type="search"
                      name="search"
                      onChange={handleChangeSearchedCode}
                    />
                    <button
                      id="company-search-button"
                      type="button"
                      className="rounded bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
                      onClick={() => {
                        console.log(searchedCode)
                        if (searchedCode === '') {
                          initCompanySearchList();
                        }
                        else {
                          let days = new Date()
                          //date one week before
                          let tarDay = days.getTime() - 1000 * 60 * 60 * 24 * 7
                          days.setTime(tarDay)
                          let year = days.getFullYear()
                          let month = days.getMonth()+1
                          if (month < 10) {
                            month = "0" + month
                          }
                          let day = days.getDate()
                          if (day < 10) {
                            day = "0" + day
                          }
                          const dateQuery = day + "/" + month + "/" + year
                          console.log(dateQuery)
                          let arr = []
                          const para = {
                            body : {
                              company_ticker: searchedCode,
                              start_date: dateQuery
                            },
                            header : {
                              Authorization: token,
                              "Access-Control-Allow-Origin": "*",
                              "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                            }
                          }
                          //console.log(para)
                          ZuluService.initCompanyList(para)
                          .then((res) => {
                            let item = {
                              companyCode: '',
                              companyName: '',
                              open: '',
                              high: '',
                              low: '',
                              close: '',
                              daily_change: '',
                              weekly_change: '',
                              monthly_change: '',            
                              otherData: []
                            }
                            if (res.data.events != null) {
                              item["companyCode"] = res.data.dataset_id
                              let latestData = res.data.events[res.data.events.length -1]
                              console.log(latestData)
                              item["open"] = latestData.attribute.open.toFixed(3)
                              item["high"] = latestData.attribute.high.toFixed(3)         
                              item["low"] = latestData.attribute.low.toFixed(3)
                              item["close"] = latestData.attribute.close.toFixed(3)
                              item["daily_change"] = latestData.attribute.daily_change.toFixed(3)
                              item["weekly_change"] = latestData.attribute.weekly_change.toFixed(3)
                              item["monthly_change"] = latestData.attribute.monthly_change.toFixed(3)
                              console.log(item)
                              arr.push(item)
                              setCompanyData(arr)
                            }                            
                          })                             
                        }
                      }}
                    >
                      Search
                    </button>
                  </div>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="px-4 sm:px-6 lg:px-8">
                    <div className="mt-8 flow-root">
                      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                          <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                              <tr>
                                <th
                                  scope="col"
                                  className="whitespace-nowrap py-3.5 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                                >
                                  Company Code
                                </th>
                                <th
                                  scope="col"
                                  className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  Open
                                </th>
                                <th
                                  scope="col"
                                  className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  Close
                                </th>
                                <th
                                  scope="col"
                                  className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  High
                                </th>
                                <th
                                  scope="col"
                                  className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  Low
                                </th>
                                <th
                                  scope="col"
                                  className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  Daily Change
                                </th>
                                <th
                                  scope="col"
                                  className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  Weekly Change
                                </th>
                                <th
                                  scope="col"
                                  className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  Monthly Change
                                </th>
                                <th
                                  scope="col"
                                  className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  Details
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {companyData.map((item) => (
                                <tr key={item.companyCode}>
                                  <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">{item.companyCode}</td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{item.open}</td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.close}</td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.high}</td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{item.low}</td>
                                  <td 
                                    className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
                                    style={{color : item.daily_change < 0 ? "red" : "#22C55E"}}
                                  >
                                    {item.daily_change}
                                  </td>
                                  <td 
                                    className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
                                    style={{color : item.weekly_change < 0 ? "red" : "#22C55E"}}
                                  >
                                    {item.weekly_change}
                                  </td>
                                  <td 
                                    className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
                                    style={{color : item.monthly_change < 0 ? "red" : "#22C55E"}}
                                  >
                                    {item.monthly_change}
                                  </td>
                                  <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                    <button
                                      id={`${item.companyCode}-company-detail-button`}
                                      className="rounded bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                      style={{ display: item.companyCode === "" ? 'none' : 'block' }}
                                      onClick={()=>{
                                        routeChange(
                                          "/" + 
                                          "chart" + 
                                          "/" +
                                          item.companyCode
                                        )
                                      }}
                                    >
                                      Details
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden bg-white shadow sm:rounded-lg"
                style={{ display: showNewsSearch ? 'block' : 'none' }}
              >
                {/* News Content Search */}
                <div className="px-4 py-5 sm:p-6">
                  <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">News Search</h1>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="relative flex items-center">
                    <MagnifyingGlassIcon
                      className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <input
                      id="news-search-field"
                      className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                      placeholder="Search news by company code"
                      type="text"
                      name="search"
                      value={newsSearchedCode}
                      onChange={e => {
                        setShowArticles(false);
                        setShowSearchResults(true);
                        handleChangeNewsSearchedCode(e);
                        }
                      }
                    />
                    <svg 
                      style={{ display: showSpinner ? 'block' : 'none' }}
                      className = 'animate-spin'
                      fill="none" 
                      height="20" 
                      viewBox="0 0 20 20" 
                      width="20" 
                      xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3.5C6.41015 3.5 3.5 6.41015 3.5 10C3.5 10.4142 3.16421 10.75 2.75 10.75C2.33579 10.75 2 10.4142 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18C9.58579 18 9.25 17.6642 9.25 17.25C9.25 16.8358 9.58579 16.5 10 16.5C13.5899 16.5 16.5 13.5899 16.5 10C16.5 6.41015 13.5899 3.5 10 3.5Z" 
                        fill="#212121"/>
                    </svg>
                  </div>
                </div>
                {searchResults && (<ul className="divide-y divide-gray-200">
                      {searchResults.map((result, index) => (
                        <li
                          key={index}
                          className="relative bg-white px-4 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 hover:bg-gray-50"
                          onClick={() => {
                            setShowSearchResults(false);
                            setShowSpinner(true);
                            setNewsSearchedCode(result['1. symbol']);
                            newsSearchCall(result['1. symbol'], result['2. name']);
                          }}
                          style={{ display: showSearchResults ? 'block' : 'none' }}
                        >
                          <div className="flex justify-between space-x-3">
                            <div className="min-w-0 flex-1">
                              <div className="block focus:outline-none">
                                <span className="absolute inset-0" aria-hidden="true" />
                                <p className="truncate text-sm font-medium text-gray-900">{result['1. symbol']}</p>
                                <p className="truncate text-sm text-gray-500">{result['2. name']}</p>
                              </div>
                            </div>
                          </div>
                        </li>
                      )
                    )}
                </ul>
                )}
                <div className="px-4 py-5 sm:p-6">
                  <div className="overflow-hidden bg-white shadow sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      {articles.map((article) => (
                        <li 
                          key={article.webTitle}
                          style={{ display: showArticles ? 'block' : 'none' }}
                        >
                          <div className="block hover:bg-gray-50">
                            <div className="flex items-center px-4 py-4 sm:px-6">
                              <div className="flex min-w-0 flex-1 items-center">
                                <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-1 md:gap-4">
                                  <p className="truncate text-sm font-medium text-indigo-600">{article.webTitle}</p>
                                </div>
                              </div>
                              <div className="flex">
                                <p className="text-sm text-gray-900 hidden md:block pr-4">
                                  <time dateTime={article.webPublicationDate}>{article.webPublicationDate}</time>
                                </p>
                                <a href={article.webUrl}>
                                  <LinkIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden bg-white shadow sm:rounded-lg"
                style={{ display: showPredictPrice ? 'block' : 'none' }}
              >
                {/* Predict Price */}
                <div className="px-4 py-5 sm:p-6">
                  <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Predict Price</h1>
                </div>

                <div className="px-4 py-5 sm:p-6">
                  <h1>Currently in development!</h1>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}