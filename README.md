# HIGH AVAILABILITY MONGODB
## 1. Base du HA : **Replica Set**

* En MongoDB, la haute disponibilité repose sur le concept de **replica set**.
* Un replica set = plusieurs instances MongoDB (**mongod**) qui contiennent **les mêmes données**.
* Rôles principaux :

  * **Primary** : reçoit les écritures et sert aussi les lectures (si tu ne précises rien).
  * **Secondaries** : répliquent les données du primary en temps réel (via oplog).
  * **Arbiter** (optionnel) : ne stocke pas de données mais participe aux élections.

---

## 2. Mécanisme de réplication

* Le **primary** écrit toutes les opérations dans son **oplog** (operation log).
* Les **secondaries** rejouent ces opérations pour rester synchronisés.
* La réplication est **asynchrone** mais très rapide → quelques millisecondes de latence.

---

## 3. Failover (élection automatique)

Quand le primary tombe :

1. Les secondaries détectent l’absence du primary (timeout ≈ 10 secondes).
2. Une **élection** démarre : un des secondaries est promu **nouveau primary**.
3. Les clients MongoDB (drivers officiels) sont conçus pour **se reconnecter automatiquement** au nouveau primary.

   * C’est pour ça que tu donnes plusieurs hôtes dans l’URI de connexion :

     ```
     mongodb://mongo1,mongo2,mongo3/mydb?replicaSet=rs0
     ```
   * Le driver gère la découverte et le failover.

Pendant l’élection :

* Les écritures sont **indisponibles** (quelques secondes).
* Mais une fois le nouveau primary élu → les écritures reprennent **sans perte**.

---

## 4. Garanties d’écriture (Write Concern)

MongoDB te permet de définir le niveau de sécurité :

* `w:1` → succès dès que le primary écrit.
* `w:majority` → succès seulement après confirmation de la majorité des nœuds → plus sûr, surtout en HA.
* Exemple en Node.js :

  ```js
  db.collection("users").insertOne(user, { writeConcern: { w: "majority" } })
  ```

---

## 5. Avantages du HA MongoDB

* **Pas de SPOF (Single Point of Failure)** : un nœud peut tomber, le cluster continue.
* **Réplication automatique** : aucune intervention manuelle pour synchroniser les données.
* **Auto-healing** : quand un nœud redémarre, il se resynchronise tout seul.
* **Drivers intelligents** : le client Node.js (ou Python, Java, etc.) gère automatiquement la redirection vers le nouveau primary.

---

##  Exemple concret

* 3 nœuds : `mongo1 (Primary)`, `mongo2 (Secondary)`, `mongo3 (Secondary)`.
* Tu arrêtes `mongo1`.
* Après ~10 secondes :

  * `mongo2` devient Primary.
  * Les clients continuent d’écrire sur `mongo2`.
* Quand `mongo1` revient, il redevient Secondary et se resynchronise.

---
