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
  ├── Register Holder ──────> Block 3
  ├── Register Verifier ────> Block 4
  ├── Register Revoker ─────> Block 5
  └── Register Auditor ─────> Block 6
                              │
                              ▼
                    Certificate Issued
                         Block 7
                              │
                              ▼
                    Certificate Verified
                         Block 8
                              │
                              ▼
                    Certificate Revoked
                         Block 9
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
