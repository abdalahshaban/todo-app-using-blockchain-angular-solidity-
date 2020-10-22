import { Component, OnInit } from '@angular/core';

import Web3 from 'web3';
import { TxData, Transaction } from "ethereumjs-tx";
import { TODO_LIST_ADDRESS, TODO_LIST_ABI } from './config';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  account: string;
  taskCount: number;
  todoListApi;
  tasks = [];
  createForm: FormGroup;
  constructor() { }

  ngOnInit() {
    this.initForm();
    this.loadBlockChainData();
    // this.makeSignedTransaction();
    // this.DeploySmartContract();
  }


  initForm() {
    this.createForm = new FormGroup(
      {
        task: new FormControl('', {
          updateOn: 'change',
          // validators: [Validators.required]
        }),
      }
    );
  }



  async loadBlockChainData() {
    const web3 = new Web3("HTTP://127.0.0.1:8545");

    const accounts = await web3.eth.getAccounts();
    this.account = accounts[0];

    this.todoListApi = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS);


    this.listOfTasks();

  }

  async listOfTasks() {
    const taskCount = await this.todoListApi.methods.taskCount().call();
    this.taskCount = taskCount;
    this.tasks = []
    for (let i = 0; i < this.taskCount; i++) {
      const task = await this.todoListApi.methods.tasks(i).call();
      this.tasks.push(task);
    }
  }

  disabled = false
  createTask() {
    this.todoListApi.methods.createTask(this.createForm.value.task).send({ from: this.account }).once('receipt', (receipt) => {
      console.log(receipt, 'receipt');
      this.createForm.reset();
      this.listOfTasks();
    })
  }

  async toggle(taskId) {
    this.disabled = true;
    await this.todoListApi.methods.toggleCompleted(taskId).send({ from: this.account })
      .once('receipt', (receipt) => {
        console.log(receipt, 'receipt');
        this.listOfTasks();
        this.disabled = false;
      })
  }

  async makeTransaction() {
    const account1 = "0xFcdB49B207c3C2A3eA49Df20a5771496eDC03500";
    const account2 = "0x82160BF58823D320242E6f5D6D6e2027c58888Fe";
    const web3 = await new Web3("HTTP://127.0.0.1:8545");
    // const web3 = await new Web3("https://mainnet.infura.io/v3/658841bbdcb9444989204bf6f7e23924");
    // const network = await web3.eth.net.getNetworkType();
    // console.log(network);
    // const accounts = await web3.eth.getAccounts();
    // console.log(accounts);
    // this.account = accounts[0];
    let balance1 = await web3.eth.getBalance(account1);
    console.log(balance1);
    let balance2 = await web3.eth.getBalance(account2);
    console.log(balance2);
    let sendTran = await web3.eth.sendTransaction(
      {
        from: account1,
        to: account2,
        value: web3.utils.toWei('1', 'ether'),
      }
    )

    console.log(sendTran);

    balance1 = await web3.eth.getBalance(account1);
    console.log(balance1);
    balance2 = await web3.eth.getBalance(account2);
    console.log(balance2);
  }

  async makeSignedTransaction() {
    const web3 = await new Web3("HTTP://127.0.0.1:8545");

    const account1 = "0xFcdB49B207c3C2A3eA49Df20a5771496eDC03500";
    const account2 = "0x82160BF58823D320242E6f5D6D6e2027c58888Fe"


    const privateKey1 = "f8010e47c4c9ee915a019d8eac2001a7aaf591f8e288ee3ec86307f21ad98dd9";
    const privateKey2 = "6c9cd55866d61b611746e5acbd1c097eaf17e9c2b535fc527f439750014a7504";


    //get transaction count
    let txCount = await web3.eth.getTransactionCount(account2);
    console.log(txCount);

    //build the transaction
    const txObject: TxData = {
      nonce: web3.utils.toHex(txCount),
      to: account1,
      value: web3.utils.toHex(web3.utils.toWei('2.5', 'ether')),
      gasLimit: web3.utils.toHex(21000),
      gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'Gwei'))
    }

    // console.log(txObject);

    //Sign the transaction

    const tx = new Transaction(txObject);
    tx.sign(Buffer.from(privateKey2, 'hex'));

    const serializedTransation = tx.serialize();

    const row = '0x' + serializedTransation.toString('hex');

    // Broadcast the transation

    let txHash = await web3.eth.sendSignedTransaction(row);
    console.log(txHash);




  }

  async WriteSmartContract() {
    const web3 = await new Web3("HTTP://127.0.0.1:8545");

    const account1 = "0xFcdB49B207c3C2A3eA49Df20a5771496eDC03500";
    const account2 = "0x82160BF58823D320242E6f5D6D6e2027c58888Fe";


    const privateKey1 = "f8010e47c4c9ee915a019d8eac2001a7aaf591f8e288ee3ec86307f21ad98dd9";
    const privateKey2 = "6c9cd55866d61b611746e5acbd1c097eaf17e9c2b535fc527f439750014a7504";


    //get transaction count
    let txCount = await web3.eth.getTransactionCount(account2);
    console.log(txCount);

    //build the transaction
    const txObject: TxData = {
      nonce: web3.utils.toHex(txCount),
      to: account1,
      value: web3.utils.toHex(web3.utils.toWei('2.5', 'ether')),
      gasLimit: web3.utils.toHex(21000),
      gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'Gwei'))
    }

    // console.log(txObject);

    //Sign the transaction

    const tx = new Transaction(txObject);
    tx.sign(Buffer.from(privateKey2, 'hex'));

    const serializedTransation = tx.serialize();

    const row = '0x' + serializedTransation.toString('hex');

    // Broadcast the transation

    let txHash = await web3.eth.sendSignedTransaction(row);
    console.log(txHash);

  }


}
