# README
<br>

# Εργαλεία που χρησιμοποιούνται


| Επίπεδο Εξαρτημάτων      | Τεχνολογία / Βιβλιοθήκη    | Σκοπός                              |
| -------------------      | -----------------------    | ----------------------------------- |
| **Frontend Framework**   | React 18, Vite, Typescript | Υλοποίηση γραφικής διεπαφής χρήστη  |
| **Πάροχος Web3**         | Ethers.js v6               | Γέφυρα” μεταξύ της διεπαφής και του έξυπνου συμβολαίου |
| **Πορτοφόλι (Wallet)**   | Metamask                   | Είσοδος, επιλογή λογαριασμού και υπογραφή συναλλαγών |
| **Έξυπνα Συμβόλαια**     | Solidity                   | Υλοποίηση έξυπνου συμβολαίου        |
| **Δίκτυο Ανάπτυξης**     | Hardhat Network            | Τοπικό blockchain για ανάπτυξη έξυπνων συμβολαίων|
| **Περιβάλλον Ανάπτυξης** | Remix                      | Συγγραφή, μεταγλώττιση, ανάπτυξη και αλληλεπίδραση με τα έξυπνα συμβόλαια        |



<br><br>
# Βασικές συναρτήσεις του συστήματος


### `registerUser`

**Πρόσβαση:** Μόνο για `admin`

Επιτρέπει μόνο στον διαχειριστή να εγγράψει έναν νέο χρήστη. Ελέγχει ότι η διεύθυνση είναι έγκυρη και ότι ο χρήστης δεν έχει ήδη εγγραφεί.

Δημιουργείται η δομή του νέου χρήστη, η οποία στη συνέχεια αποθηκεύεται στο array `allUsers`. Τέλος, εκπέμπεται το event δημιουργίας νέου χρήστη.

---

### `getAllUsers`

**Πρόσβαση:** `admin`, `auditor`

Επιστρέφει τη λίστα όλων των εγγεγραμμένων χρηστών μαζί με τα στοιχεία τους.

---

### `issueCertificate`

**Πρόσβαση:** Μόνο για `issuer`

Δημιουργεί ένα νέο πιστοποιητικό, ελέγχοντας πρώτα ότι η διεύθυνση του holder είναι έγκυρη και ότι το `fileHash` δεν υπάρχει ήδη στο σύστημα.

Το ID του πιστοποιητικού λαμβάνεται από τη μεταβλητή `nextCertificateId`, η οποία αυξάνεται κάθε φορά που δημιουργείται ένα νέο πιστοποιητικό. Η αρχική κατάσταση του πιστοποιητικού ορίζεται ως `Valid`.

Στη συνέχεια, το πιστοποιητικό προστίθεται στις παρακάτω δομές:

* `holderCertificates`
* `issuerCertificates`
* `certificateByHash`
* `allCertificates`

Τέλος, εκπέμπεται το event καταχώρησης νέου πιστοποιητικού.

---

### `getAllCertificates`

**Πρόσβαση:** `admin`, `auditor`

Επιστρέφει όλα τα πιστοποιητικά που έχουν καταχωριστεί στο blockchain, μαζί με τα στοιχεία τους.

---

### `getIssuerCertificates`

**Πρόσβαση:** Μόνο για `issuer`

Επιστρέφει όλα τα πιστοποιητικά που έχουν εκδοθεί από έναν συγκεκριμένο issuer.

---

### `getHolderCertificates`

**Πρόσβαση:** Μόνο για `holder`

Επιστρέφει όλα τα πιστοποιητικά που έχουν καταχωριστεί για έναν συγκεκριμένο holder.

---

### `verifyCertificateById`

**Πρόσβαση:** `auditor`, `verifier`

Επιτρέπει την επαλήθευση ενός πιστοποιητικού με βάση το ID του.

Η συνάρτηση αναζητά το συγκεκριμένο ID στο `certificates` mapping και επιστρέφει τα στοιχεία του πιστοποιητικού.

Τέλος, εκπέμπεται το event επαλήθευσης πιστοποιητικού.

---

### `verifyCertificateByHash`

**Πρόσβαση:** `auditor`, `verifier`

Επιτρέπει την επαλήθευση ενός πιστοποιητικού με βάση το `fileHash` του.

Η συνάρτηση αναζητά το συγκεκριμένο hash στο `certificates` mapping και επιστρέφει τα στοιχεία του πιστοποιητικού.

Τέλος, εκπέμπεται το event επαλήθευσης πιστοποιητικού.

---

### `revokeCertificate`

**Πρόσβαση:** Μόνο για `revocation officer`

Πραγματοποιεί την ανάκληση ενός πιστοποιητικού με βάση το ID του.

Αρχικά ελέγχει ότι:

* το πιστοποιητικό υπάρχει στο `certificates` mapping,

<br><br>


# Οι ρόλοι των χρηστών

* **Admin:** Ο λογαριασμός που κάνει το deployment γίνεται ο πρώτος διαχειριστής και μπορεί να εγγράφει χρήστες και να τους αναθέτει ρόλους.

* **Issuer:** Εκδίδει ψηφιακά πιστοποιητικά και καταχωρεί τα στοιχεία τους στο blockchain.

* **Holder:** Βλέπει τα πιστοποιητικά που έχουν εκδοθεί για τον ίδιο.

* **Verifier:** Ελέγχει την κατάσταση και την εγκυρότητα ενός πιστοποιητικού.

* **Auditor:** Έχει πρόσβαση στα στοιχεία του συστήματος για έλεγχο και εποπτεία.

* **Revocation Officer:** Μπορεί να ανακαλεί πιστοποιητικά και να καταχωρεί τον λόγο ανάκλησης.


<br><br>
# Οδηγίες Εγκατάστασης και Εκτέλεσης

Το project αποτελείται από ένα **Smart Contract**, ένα local **Hardhat blockchain**, το **Remix** για το deployment του contract και ένα **UI** για την αλληλεπίδραση με το blockchain μέσω **MetaMask**.


## Προαπαιτούμενα

* [Node.js](https://nodejs.org/)
* [MetaMask](https://metamask.io/)
* Πρόσβαση στο [Remix IDE](https://remix.ethereum.org/)



## 1. Hardhat

Το Hardhat χρησιμοποιείται για τη δημιουργία και εκτέλεση ενός local Ethereum blockchain.

#### Αρχικοποίηση και εκκίνηση Local Blockchain

```bash
npx hardhat --init
npx hardhat node
```

Κατά την εκκίνηση του node, το Hardhat εμφανίζει την διεύθυνση στην οποία θα τρέχει και μια σειρά από test accounts και τα αντίστοιχα private keys τους.
## 2. Remix

Το Remix χρησιμοποιείται για το compile και το deployment του Smart Contract στο local Hardhat blockchain.

### Δημιουργία Project

1. Ανοίξτε το [Remix IDE](https://remix.ethereum.org/).
2. Δημιουργήστε ένα νέο project.
3. Προσθέστε στο project τον κώδικα του Smart Contract της εργασίας.

### Compile

Από το **Solidity Compiler**:

1. Επιλέξτε την κατάλληλη έκδοση του Solidity compiler.
2. Κάντε **Compile** το Smart Contract.

### Deploy

Από το **Deploy & Run Transactions**:

1. Στο **Environment** επιλέξτε:  Custom - External Http Provider

2. Ως **RPC URL** χρησιμοποιήστε: http://127.0.0.1:8545 ή την διεύθυνση που σας έχει δηλώσει το hardhat ότι τρέχει το τοπικό blockchain.

3. Κάντε **Deploy** το Smart Contract.

Η διεύθυνση από το **Contract Address** θα χρησιμοποιηθεί στη συνέχεια στο UI για να οριστεί ο διαχειριστής.


## 3. MetaMask

Το MetaMask χρησιμοποιείται ως wallet και ως μέσο σύνδεσης του UI με το local Hardhat blockchain.

### 3.1 Εγκατάσταση MetaMask

Εγκαταστήστε το [MetaMask](https://metamask.io/) ως extension στον browser σας.


### 3.2 Προσθήκη Hardhat Network στο MetaMask

Στο MetaMask προσθέστε ένα νέο network με τις παρακάτω ρυθμίσεις:

| Ρύθμιση             | Τιμή                    |
| ------------------- | ----------------------- |
| **Network Name**    | Hardhat Local           |
| **New RPC URL**     | `http://127.0.0.1:8545` |
| **Chain ID**        | `31337`                 |
| **Currency Symbol** | `ETH`                   |

Αποθηκεύστε το network και επιλέξτε το **Hardhat Local** ως ενεργό network.

> **Σημείωση:** Αν το Hardhat εμφανίζει διαφορετικό Chain ID κατά την εκκίνηση, χρησιμοποιήστε εκείνο το Chain ID.

---

### 3.3 Εισαγωγή Hardhat Account στο MetaMask

Για να χρησιμοποιήσετε έναν από αυτούς τους λογαριασμούς:

1. Στο terminal όπου εκτελείται το Hardhat node, εντοπίστε έναν από τους διαθέσιμους accounts.
2. Αντιγράψτε το **Private Key** του account.
3. Στο MetaMask επιλέξτε: 
Account → Add account or hardware wallet → Import account

Μετά την εισαγωγή ο λογαριασμός θα εμφανιστεί στο MetaMask και θα διαθέτει τα test ETH που παρέχει το Hardhat.

> **Σημείωση:** Για να συνδεθείτε σαν διχαειριστής θα πρέπει να χρησιμοποιήσετε την διεύθυνση του account που έχει κάνει το deploy στο REMIX.



## 4. UI

Το UI χρησιμοποιείται για την αλληλεπίδραση με το Smart Contract μέσω του MetaMask.

### 4.1 Εγκατάσταση Dependencies

Ανοίξτε ένα **νέο terminal** στον φάκελο του UI project και εκτελέστε:

```bash
npm install
```

### 4.2 Ρύθμιση Environment Variables

Στον φάκελο του UI δημιουργήστε ένα αρχείο .env και προσθέστε το 
VITE_CONTRACT_ADDRESS με τιμή το Contract Address που πήρατε από το deployment στο Remix.

Για παράδειγμα:

```env
VITE_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
```


### 4.3 Εκκίνηση UI

Για να ξεκινήσετε την εφαρμογή:

```bash
npm run dev
```

Το Vite θα εμφανίσει στο terminal τη διεύθυνση στην οποία εκτελείται η εφαρμογή. Συνήθως είναι: 
http://localhost:5173


<br><br>


# Δοκιμαστικά δεδομένα -Blockchain Certificate Workflow
## Block 1  Admin User Registered

**Admin:** `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

**Transaction:** `0xe3815061de92955a61b2be8dcf1f98fda5b2426133dd5cc89a595bda39ff2a47`


## Block 2 — User Issuer Registered by Admin

**Issuer:** `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`

**Transaction:** `0xc2c7eb83f17ee2a11dc6e96041e6b486c8ca78066cf55ca7fea63f27bf3a2709`


## Block 3 — User Holder Registered by Admin

**Holder:** `0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199`

**Transaction:** `0x5fe6a0c12a4d3f31aabec891d17aabaad6600cb3a10707d1697ea6716e09c44e`



## Block 4 — User Verifier Registered by Admin

**Verifier:** `0xdD2FD4581271e230360230F9337D5c0430Bf44C0`

**Transaction:** `0x81d2f8d3775e6e3a886599f322fdd6c2bdeae7653cce6e35c6ebec837825d04d`



## Block 5 — User Revoker Registered by Admin

**Revoker:** `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`

**Transaction:** `0xe2071f45c50bb0709fecdf0a2e6e7f32d86c32b1eac68d8bab86bc3555f4163c`



## Block 6 — User Auditor Registered by Admin

**Auditor:** `0x90F79bf6EB2c4f870365E785982E1f101E93b906`

**Transaction:** `0x1a31d2d6d7ca09e0aa1c126b7cbdc6a9f40422cec20eb3f1df20aa1994c19297`


## Block 7 — Certificate Issued


 **From / Issuer**  `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`                         
 **To / Holder**    `0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199`                      
  **Certificate ID** `1`    
  **File Hash**      `d17f25ecfbcc7857f7bebea469308be0b2580943e96d13a3ad98a13675c4bfc2`   
 **Transaction**    `0xa94224bc51f7315fd6dada2b078e262a8ebed7ec660c0141b5528bed751cd216` 



## Block 8 — Certificate Verified


 **Certificate ID** `1`                                                                  
 **File Hash**      `d17f25ecfbcc7857f7bebea469308be0b2580943e96d13a3ad98a13675c4bfc2`  
 **Issuer**         `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`    
  **Holder**    `0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199`                      
 **Verifier**       `0xdD2FD4581271e230360230F9337D5c0430Bf44C0`                        
 **Transaction**    `0xe90e69761733eeff9eece21c64020e0a1988811106f1e3cc3dc8c7ad59b1e114` 



## Block 9 — Certificate Revoked

 **Certificate ID**  `1`                                                                  
 **Reason**          `test`                                                               
 **Revoker**         `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`                         
 **Transaction**     `0x96948f47f98051aed7e7f96fc58375a094d60fc4c2cd33a256e91d6424cd02dc` 




## Block 10 — User Holder Registered by Admin

**Holder:** `0xa0Ee7A142d267C1f36714E4a8F75612F20a79720`

**Transaction:** `0x0560c589c933002a3374fc891b569b961fe81865cff7a33960b483ba9371e37b`



## Block 11 — Certificate Issued

 **From / Issuer**  `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`                         
 **To / Holder**    `0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199`                      
  **Certificate ID** `2`    
  **File Hash**      `8e35c2cd3bf6641bdb0e2050b76932cbb2e6034a0ddacc1d9bea82a6ba57f7cf`   
 **Transaction**    `0x653fdb731148aa4925dea4e42ab5dc2642f12b9084716356c0a1edd0dc1201d0` 


## Block 12 — Certificate Issued

 **From / Issuer**  `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`                         
 **To / Holder**    `0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199`                      
  **Certificate ID** `3`    
  **File Hash**      `148de9c5a7a44d19e56cd9ae1a554bf67847afb0c58f6e12fa29ac7ddfca9940`   
 **Transaction**    `0x1c5a98d9b9234a06a2d0ec1274fa8f0374ebace736f575c70c5edde2f0d1466f` 

## Block 13 — Certificate Issued

 **From / Issuer**  `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`                         
 **To / Holder**    `0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199`                      
  **Certificate ID** `4`    
  **File Hash**      `03042cf8100db386818cee4ff0f2972431a62ed78edbd09ac08accfabbefd818`   
 **Transaction**    `0xe51dd13340b99ab750a83542d4e0a1bcf58f53c24fd2ed2f7d42d2cb191a8dcd` 



## Block 14 — Certificate Issued

 **From / Issuer**  `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`                         
 **To / Holder**    `0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199`                      
  **Certificate ID** `5`    
  **File Hash**      `1cf0e1cd5270967e7e5b4749ef214b53b4be9591b8126f98addd441bc748349f`   
 **Transaction**    `0x4ea426e97714edf80227e5189578c2f439ef1dacc2034138f0fec82b50a764fd` 


## Block 15 — Certificate Issued

 **From / Issuer**  `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`                         
 **To / Holder**    `0xa0Ee7A142d267C1f36714E4a8F75612F20a79720`                      
  **Certificate ID** `6`    
  **File Hash**      `69c484bfcab87afc008e164767eddfceafb2075f6553397ffa429a71572bd82b`   
 **Transaction**    `0x9ac20b832f6b81232985ada4bd9d8779701e5a2bd3257af88e0d0817b3c091b7` 
## Block 16 — Certificate Issued

 **From / Issuer**  `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`                         
 **To / Holder**    `0xa0Ee7A142d267C1f36714E4a8F75612F20a79720`                      
  **Certificate ID** `7`    
  **File Hash**      `775b97c7ac87e24d06954929132cc2e7b8b6aba76645f94b1aa91c1e55712706`   
 **Transaction**    `0xe54ee90eec54e59661706149268101eacc3f3ed58db2b2111e94ba1a7227ae44`

## Block 17 — Certificate Issued

 **From / Issuer**  `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`                         
 **To / Holder**    `0xa0Ee7A142d267C1f36714E4a8F75612F20a79720`                      
  **Certificate ID** `8`    
  **File Hash**      `8c4f1cb26e1b8dce16fd0d9b7377d22e5e0a317218c9945d736c80b83f64dab6`   
 **Transaction**    `0x065dcfde68c612bd9541d8ab94632763d7dbf3a1d1221f270be259c3a2cb47a4` 


## Block 18 — Certificate Issued

 **From / Issuer**  `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`                         
 **To / Holder**    `0xa0Ee7A142d267C1f36714E4a8F75612F20a79720`                      
  **Certificate ID** `9`    
  **File Hash**      `d8efd073cafda9084e1f4d63c00b970ee0222cb2cb76d59a546ceed4db69ac04`   
 **Transaction**    `0xf68357b95d3422d3705486aebddb9ed56a0ec3d6e30d4912f18183072c0f3767` 


## Block 19 — Certificate Issued

 **From / Issuer**  `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`                         
 **To / Holder**    `0xa0Ee7A142d267C1f36714E4a8F75612F20a79720`                      
  **Certificate ID** `10`    
  **File Hash**      `9c073f316ee43b72f05cba34d7d31267ef721bb659c2381c160f2ba86caab528`   
 **Transaction**    `0xd0662f911e59832a82011b8324606534ef0e79a7d2b48f5fadd8e045db6195a4` 


## Block 20 — Certificate Issued

 **From / Issuer**  `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`                         
 **To / Holder**    `0xa0Ee7A142d267C1f36714E4a8F75612F20a79720`                      
  **Certificate ID** `11`    
  **File Hash**      `5bfb8b2291f73a47e80e0ea57756c4427ceb24d871e62071025852384672782a`   
 **Transaction**    `0x8f1d4ef6ad6fbab267faeb9dedfadac7acabaed48c3b6aaf3b145de33ab18fe6` 












## Registered Roles

| Role     | Address                                      |
| -------- | -------------------------------------------- |
| User     | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` |
| Issuer   | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` |
| Holder   | `0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199` |
| Verifier | `0xdD2FD4581271e230360230F9337D5c0430Bf44C0` |
| Revoker  | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` |
| Auditor  | `0x90F79bf6EB2c4f870365E785982E1f101E93b906` |


### Transaction Flow

```text
Admin
  │
  ├── Register Issuer ──────> Block 2
  ├── Register Holder #1 ───> Block 3
  ├── Register Verifier ────> Block 4
  ├── Register Revoker ─────> Block 5
  ├── Register Auditor ─────> Block 6
  │
  │      Issuer
  │        │
  │        ├── Issue Certificate #1 ──> Block 7
  │        │
  │        │     Verifier
  │        │        │
  │        │        └── Verify Certificate #1 ─> Block 8
  │        │ 
  │        │     Revoker
  │        │        │
  │        │        └── Revoke Certificate #1 ─> Block 9
  │        │
  └── Register Holder #2 ───> Block 10
           │
           ├── Issue Certificate #2 ──> Block 11
           ├── Issue Certificate #3 ──> Block 12
           ├── Issue Certificate #4 ──> Block 13
           ├── Issue Certificate #5 ──> Block 14
           ├── Issue Certificate #6 ──> Block 15
           ├── Issue Certificate #7 ──> Block 16
           ├── Issue Certificate #8 ──> Block 17
           ├── Issue Certificate #9 ──> Block 18
           ├── Issue Certificate #10 ─> Block 19
           └── Issue Certificate #11 ─> Block 20



```


<br><br>


# Έλεγχοι ασφαλείας

Για τον βασικό έλεγχο ασφαλείας του Smart Contract χρησιμοποιήθηκαν τα εργαλεία **Solhint** και **Slither**, μέσω του **Remix IDE**.

### Solhint

Το **Solhint** χρησιμοποιήθηκε μέσω του αντίστοιχου plugin του Remix IDE.

Από το Remix ενεργοποιήθηκε το **Solhint** και πραγματοποιήθηκε στατική ανάλυση του Smart Contract.

Τα ευρήματα αφορούν κυρίως **best practices** του κώδικα και δεν αποτελούν προβλήματα ασφαλείας ή λειτουργικότητας.

Ενδεικτικά αποτλέσματα:

1. Χρήση **Custom Errors** αντί για `require`, για βελτιστοποίηση του gas.
2. Σωστή ονοματολογία μεταβλητών, όπως `SNAKE_CASE` για `immutable` μεταβλητές.
3. Ρητή δήλωση **visibility** στις συναρτήσεις.




### Slither

Για τη χρήση του **Slither** απαιτείται πρώτα η εγκατάστασή του μέσω του **Remix Terminal**.

#### Εγκατάσταση

Ανοίγουμε το **Terminal** του Remix IDE και εκτελούμε την εντολή εγκατάστασης του Slither:

```bash
pip3 install slither-analyzer
```

ή, ανάλογα με το περιβάλλον:

```bash
pip install slither-analyzer
```

Μετά την ολοκλήρωση της εγκατάστασης, το εργαλείο μπορεί να χρησιμοποιηθεί για τη στατική ανάλυση του Smart Contract.

#### Εκτέλεση ελέγχου

Από το περιβάλλον του **Slither** στο Remix επιλέγουμε το Smart Contract που θέλουμε να ελέγξουμε και εκτελούμε την ανάλυση.

Το Slither εντόπισε δύο δυνητικά ζητήματα:

**1. Timestamp dependence**

Στη συνάρτηση `checkCertificateStatus` γίνεται σύγκριση της ημερομηνίας λήξης με το `block.timestamp`.

Η συγκεκριμένη προειδοποίηση αφορά τη δυνατότητα μικρής απόκλισης στο timestamp ενός block. Στην παρούσα εφαρμογή δεν θεωρείται σημαντική, καθώς η διάρκεια ισχύος των πιστοποιητικών υπολογίζεται σε κλίμακα ημερών και όχι δευτερολέπτων.

**2. solc-version**

Χρησιμοποιείται η έκδοση Solidity `0.8.20`, για την οποία το Slither αναφέρει γνωστές ευπάθειες του compiler, όπως `VerbatimInvalidDeduplication` και `FullInlinerNonExpressionSplitArgumentEvaluationOrder`.

Η συγκεκριμένη προειδοποίηση αφορά την έκδοση του Solidity compiler και όχι τη λογική του Smart Contract.
