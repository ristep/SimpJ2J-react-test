import React, { useState } from "react";
import logo from "./lynx.svg";
import "./App.css";
import axios from "axios";
import ReactJson from "react-json-view";
import Button from "./buttons";

import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

const axParams = {
	baseURL: "https://laplap-capi.sman.cloud/",
	headers: {
		"Authorization": "dummy-key",
		"Content-type": "application/json"
	}
};
const Axios = axios.create(axParams);

function App() {
	const [result, setResult] = useState({
		text: "Kliko testing APP",
		kliko01: 0,
		kliko02: 0
	});
	const [jsonQuery, setJsonQuery] = useState({}); // jsonQuery send to server
	const [retData, setRetData] = useState({});     // obtained data from server
	const [tokenData, setTokenData] = useState({}); // auth token

	const getToken = (args) => {
		const { url = 'tokenizer/', userName, password } = args;
		console.log(url);
		const fetchToken = async () => {
			const result = await Axios.post(url, {
				name: userName,
				password: password
			});
			setTokenData(result.data);
		}
		fetchToken();
	}

	const getJsonData = jreq => {
		const fetchData = async () => {
			const result = await Axios.post("", jreq, {headers:{ "Authorization": tokenData.auToken }} );
			setRetData(result.data);
		};
		fetchData();
		setResult({ ...result, retData });
		setJsonQuery(jreq);
	};

	const onClickSelectFoods = () => {
		getJsonData({
			sqlStatement: "select",
			table: "foods",
			fields: ["id", "name"]
		});
	};

	const selectFood = (fid) => {
		getJsonData({
			sqlStatement: "select",
			table: "foods",
			fields: ["id", "name"],
			keyData: { id: fid }
		});
	};

	const onClickSelectFoodsKeyData = (keyData) => {
		getJsonData({
			sqlStatement: "select",
			table: "foods",
			keyData
		});
	};

	const onClickClearData = () => {
		setRetData({});
		setJsonQuery({});
	};

	const selectUsersKeyData = keyData => {
		getJsonData({
			sqlStatement: "select",
			table: "users",
			fields: ["id", "first_name", "second_name", "place"],
			keyData
		});
	};

	const insertFood = () => {
		getJsonData({
			sqlStatement: "insert",
			table: "foods",
			data: { id: 980, name: "Jatki za popredok" }
		});
	};

	const deleteFood = (keyData) => {
		getJsonData({
			table: "foods",
			sqlStatement: "delete",
			keyData
		});
	};

	const updateFood = (keyData) => {
		getJsonData({
			table: "foods",
			sqlStatement: "update",
			data: { name: 'Updated food name' },
			keyData
		});
	};

	const onClickSelectUsers = () => {
		getJsonData({
			table: "users",
			sqlStatement: "select",
			fields: ["id", "name", "role", "state", "email"]
		});
	};

	const onChangeJSON = (jr) => {
		getJsonData(jr.jsObject);
	}; 

	return ( 
		<div className="App">
			<label className="sitno-text top-right">React: {React.version} </label>
  		<header className="App-header">
				<img src={logo} className="App-logo top-left" alt="logo" />
				<p>
					Application for testing <Button href="https://github.com/ristep/json-query-php-api" target="_blank">json-query-php-api</Button>
					<hr />
					<Button onClick={() => getToken({ userName: 'mavro', password: 'mavro' })}>Get User Tokoen</Button>
					<label>{tokenData.first_name} {tokenData.second_name}</label>
				</p>
			</header>
			<div className="btn-group">
			<Button onClick={() => onClickSelectFoods()}>Select Foods</Button>
			<Button onClick={() => getJsonData({ table: "foods", sqlStatement: "select" })}>
				Select Foods v2.0
      </Button>
			<Button onClick={() => onClickSelectFoodsKeyData({ name: "Lollipop" })}>Select Food name='Lollipop'</Button>
			</div>
			<div className="btn-group">
			<Button onClick={() => insertFood()}>Insert Food</Button>
			<Button onClick={() => updateFood({ id: 980 })}>Update Food id:980 </Button>
			<Button onClick={() => selectFood(980)}>Select Food id:980 </Button>
			<Button onClick={() => deleteFood({ id: 980 })}>Delete Food id:980 </Button>
			</div>
			<div className="btn-group">
			<Button onClick={() => getJsonData({ table: 'lekovi', sqlStatement: 'select', limit: [5, 12] })}>Select 'lekovi'</Button>
			<Button onClick={() => getJsonData({ table: 'lekovi', sqlStatement: 'select', filter: "atc_kod,sw,J01MA1" })}>Select 'lekovi' with filter</Button>
			<Button onClick={() => getJsonData({ table: 'lekovi', sqlStatement: 'select', filter: ['atc_kod,sw,G04CB', 'and', ['id,gt,2040', 'or', 'id,eq,468']], limit: [0, 12] })}>Select 'lekovi' with filter 2</Button>
			</div>
			<div className="btn-group">
			<Button onClick={() => onClickSelectUsers()}>Select Users</Button>
			<Button onClick={() => selectUsersKeyData({ role: "user" })}>Select Users by keyData "role='user'"</Button>
			<Button onClick={() => getJsonData({ phpFunction:"phpTestPrintout" })}>PHP RPC test</Button>
			</div>
			<div className="btn-group">
			<JSONInput
				placeholder={jsonQuery} // query to display
				onChange={onChangeJSON}
				// theme="light_mitsuketa_tribute"
				locale={locale}
				height="auto"
				withd="1200px"
			/>
			</div>
			<div className="btn-group">
			<Button onClick={() => onClickClearData()}> Clear Data</Button>
			</div>
			<div className="App-body btn-group">
				{/* <ReactJson src={jsonQuery} name="jsonQuery" /> */}
				<ReactJson src={retData} name="Data" />
				<ReactJson src={tokenData} name="UserTokenData" collapsed />
			</div>
		</div>
	);
}

export default App;
