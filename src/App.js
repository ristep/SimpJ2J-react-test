import React, { useState } from "react";
import logo from "./lynx.svg";
import "./App.css";

import { ButtonToolbar, Navbar } from 'react-bootstrap';
import axios from "axios";
import ReactJson from "react-json-view";
import Btn from "./buttons";

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
		text: "Click testing APP",
		Click01: 0,
		Clock02: 0
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
			data: { id: 980, name: "Seeds for beer" }
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
  		<Navbar className="App-header">
				<img src={logo} className="App-logo top-left" alt="logo" />
				<p>
					Application for testing <Btn href="https://github.com/ristep/SimpJ2J" target="_blank"> SimpJ2J </Btn>
					<hr />
					<Btn onClick={() => getToken({ userName: 'mavro', password: 'mavro' })}>Get User Token</Btn>
					<label>{tokenData.first_name} {tokenData.second_name}</label>
				</p>
			</Navbar>
			<ButtonToolbar>
			<Btn onClick={() => onClickSelectFoods()}>Select Foods</Btn>
			<Btn onClick={() => getJsonData({ table: "foods", sqlStatement: "select" })}>
				Select Foods v2.0
      </Btn>
			<Btn onClick={() => onClickSelectFoodsKeyData({ name: "Lollipop" })}>Select Food name='Lollipop'</Btn>
			</ButtonToolbar>
			<ButtonToolbar>
			<Btn onClick={() => insertFood()}>Insert Food</Btn>
			<Btn onClick={() => updateFood({ id: 980 })}>Update Food id:980 </Btn>
			<Btn onClick={() => selectFood(980)}>Select Food id:980 </Btn>
			<Btn onClick={() => deleteFood({ id: 980 })}>Delete Food id:980 </Btn>
			</ButtonToolbar>
			<ButtonToolbar>
			<Btn onClick={() => getJsonData({ table: 'lekovi', sqlStatement: 'select', limit: [5, 12] })}>Select 'lekovi'</Btn>
			<Btn onClick={() => getJsonData({ table: 'lekovi', sqlStatement: 'select', filter: "atc_kod,sw,J01MA1" })}>Select 'lekovi' with filter</Btn>
			<Btn onClick={() => getJsonData({ table: 'lekovi', sqlStatement: 'select', filter: ['atc_kod,sw,G04CB', 'and', ['id,gt,2040', 'or', 'id,eq,468']], limit: [0, 12] })}>Select 'lekovi' with filter 2</Btn>
			</ButtonToolbar>
			<ButtonToolbar>
			<Btn onClick={() => onClickSelectUsers()}>Select Users</Btn>
			<Btn onClick={() => selectUsersKeyData({ role: "user" })}>Select Users by keyData "role='user'"</Btn>
			<Btn onClick={() => getJsonData({ phpFunction:"phpTestPrintout" })}>PHP RPC test</Btn>
			</ButtonToolbar>
		  <br />
			<JSONInput
				placeholder={jsonQuery} // query to display
				onChange={onChangeJSON}
				theme="light_mitsuketa_tribute"
				locale={locale}
				height="auto"
				width="auto"
			/>
			<div>
			<Btn onClick={() => onClickClearData()}> Clear Data</Btn>
			</div>
			<div className="App-body">
				{/* <ReactJson src={jsonQuery} name="jsonQuery" /> */}
				<ReactJson src={retData} name="Data" />
				<ReactJson src={tokenData} name="UserTokenData" collapsed />
			</div>
		</div>
	);
}

export default App;
