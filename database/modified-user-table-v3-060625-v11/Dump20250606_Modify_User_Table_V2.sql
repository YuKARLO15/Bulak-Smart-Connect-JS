CREATE DATABASE  IF NOT EXISTS `bulak_smart_connect` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `bulak_smart_connect`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: bulak_smart_connect
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `createdBy` varchar(100) NOT NULL DEFAULT 'admin',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcements`
--

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
INSERT INTO `announcements` VALUES (6,'Hiiii','\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum','',1,'admin','2025-06-05 20:42:01.035494','2025-06-05 20:42:01.035494');
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `application_status_history`
--

DROP TABLE IF EXISTS `application_status_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application_status_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `application_id` varchar(50) NOT NULL,
  `old_status` varchar(50) DEFAULT NULL,
  `new_status` varchar(50) NOT NULL,
  `status_message` text,
  `changed_by` int DEFAULT NULL,
  `changed_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `IDX_047747941d0e4ef22ea7ca6473` (`changed_at`),
  KEY `IDX_a461ff43395424ebd6e218deb3` (`application_id`),
  CONSTRAINT `FK_a461ff43395424ebd6e218deb32` FOREIGN KEY (`application_id`) REFERENCES `document_applications` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_status_history`
--

LOCK TABLES `application_status_history` WRITE;
/*!40000 ALTER TABLE `application_status_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `application_status_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `address` varchar(255) NOT NULL,
  `reasonOfVisit` varchar(255) NOT NULL,
  `appointmentDate` date NOT NULL,
  `status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
  `userId` int DEFAULT NULL,
  `isGuest` tinyint NOT NULL DEFAULT '0',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `appointmentNumber` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `middleInitial` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) NOT NULL,
  `appointmentTime` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_dc42b126dbf1ec5310d769e1b2` (`appointmentNumber`),
  KEY `FK_appointment_user` (`userId`),
  CONSTRAINT `FK_appointment_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES (7,'0681, Purok Bagong Barrio','Birth Certificate','2025-06-03','pending',5,0,'2025-06-03 21:32:21.659911','2025-06-03 21:32:21.659911','APPT-20250603-7732','Karlo Robert','Wagan','C','09425678912','11:00 AM - 11:30 AM');
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `counters`
--

DROP TABLE IF EXISTS `counters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `counters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `current_queue_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_dbbe4f9e33d2ec7b384c2a63e9` (`current_queue_id`),
  KEY `fk_current_queue` (`current_queue_id`),
  CONSTRAINT `fk_current_queue` FOREIGN KEY (`current_queue_id`) REFERENCES `queues` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `counters`
--

LOCK TABLES `counters` WRITE;
/*!40000 ALTER TABLE `counters` DISABLE KEYS */;
/*!40000 ALTER TABLE `counters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `document_applications`
--

DROP TABLE IF EXISTS `document_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `document_applications` (
  `id` varchar(50) NOT NULL,
  `user_id` int DEFAULT NULL,
  `application_type` enum('Birth Certificate','Marriage Certificate','Marriage License','Death Certificate','Business Permit') NOT NULL,
  `application_subtype` varchar(100) DEFAULT NULL,
  `status` enum('Pending','Processing','Approved','Rejected','Ready for Pickup') NOT NULL DEFAULT 'Pending',
  `status_message` text,
  `form_data` json NOT NULL,
  `last_modified_by` int DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `IDX_db7be709a9131790a29cadaee6` (`created_at`),
  KEY `IDX_421df08beb68f8876edf70b24b` (`status`),
  KEY `IDX_532567093384e3e09218eac0b7` (`application_type`),
  KEY `IDX_e076f58fe0f60c7746d16c1fdd` (`user_id`),
  CONSTRAINT `FK_e076f58fe0f60c7746d16c1fdd5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document_applications`
--

LOCK TABLES `document_applications` WRITE;
/*!40000 ALTER TABLE `document_applications` DISABLE KEYS */;
INSERT INTO `document_applications` VALUES ('BC-059300',5,'Birth Certificate','Copy of Birth Certificate','Pending','Application submitted with all required documents','{\"city\": \"San Ildefonso\", \"purpose\": \"Marriage License\", \"birthDay\": \"15\", \"lastName\": \"Wagan\", \"province\": \"Bulacan\", \"birthYear\": \"2003\", \"firstName\": \"Karlo Robert\", \"birthMonth\": \"January\", \"middleName\": \"Castro\", \"isCopyRequest\": true, \"fatherLastName\": \"Wagan\", \"motherLastName\": \"Castro\", \"fatherFirstName\": \"Roberto\", \"motherFirstName\": \"Erlinda\", \"fatherMiddleName\": \"Calatay\", \"motherMiddleName\": \"Cruz\"}',NULL,'2025-06-05 18:07:39.330203','2025-06-05 18:07:51.000000'),('BC-079011',5,'Birth Certificate','Copy of Birth Certificate','Pending',NULL,'{\"city\": \"San Ildefonso\", \"purpose\": \"Marriage License\", \"birthDay\": \"15\", \"lastName\": \"Wagan\", \"province\": \"Bulacan\", \"birthYear\": \"2003\", \"firstName\": \"Karlo Robert\", \"birthMonth\": \"January\", \"middleName\": \"Castro\", \"isCopyRequest\": true, \"fatherLastName\": \"Wagan\", \"motherLastName\": \"Castro\", \"fatherFirstName\": \"Roberto\", \"motherFirstName\": \"Erlinda\", \"fatherMiddleName\": \"Calatay\", \"motherMiddleName\": \"Cruz\"}',NULL,'2025-06-04 21:51:19.042690','2025-06-04 21:51:19.042690'),('BC-443912',5,'Birth Certificate','Copy of Birth Certificate','Pending',NULL,'{\"city\": \"San Ildefonso\", \"purpose\": \"Marriage License\", \"birthDay\": \"15\", \"lastName\": \"Wagan\", \"province\": \"Bulacan\", \"birthYear\": \"2003\", \"firstName\": \"Karlo Robert\", \"birthMonth\": \"January\", \"middleName\": \"Castro\", \"isCopyRequest\": true, \"fatherLastName\": \"Wagan\", \"motherLastName\": \"Castro\", \"fatherFirstName\": \"Roberto\", \"motherFirstName\": \"Erlinda\", \"fatherMiddleName\": \"Calatay\", \"motherMiddleName\": \"Cruz\"}',NULL,'2025-06-04 22:47:23.940500','2025-06-04 22:47:23.940500'),('BC-906303',5,'Birth Certificate','Copy of Birth Certificate','Pending',NULL,'{\"city\": \"San Ildefonso\", \"purpose\": \"Marriage License\", \"birthDay\": \"15\", \"lastName\": \"Wagan\", \"province\": \"Bulacan\", \"birthYear\": \"2003\", \"firstName\": \"Karlo Robert\", \"birthMonth\": \"January\", \"middleName\": \"Castro\", \"isCopyRequest\": true, \"fatherLastName\": \"Wagan\", \"motherLastName\": \"Castro\", \"fatherFirstName\": \"Roberto\", \"motherFirstName\": \"Erlinda\", \"fatherMiddleName\": \"Calatay\", \"motherMiddleName\": \"Cruz\"}',NULL,'2025-06-04 22:21:46.312333','2025-06-04 22:21:46.312333'),('BC-940171',5,'Birth Certificate','Copy of Birth Certificate','Pending','Application submitted with all required documents','{\"city\": \"San Ildefonso\", \"purpose\": \"Marriage License\", \"birthDay\": \"15\", \"lastName\": \"Wagan\", \"province\": \"Bulacan\", \"birthYear\": \"2003\", \"firstName\": \"Karlo Robert\", \"birthMonth\": \"January\", \"middleName\": \"Castro\", \"isCopyRequest\": true, \"fatherLastName\": \"Wagan\", \"motherLastName\": \"Castro\", \"fatherFirstName\": \"Roberto\", \"motherFirstName\": \"Erlinda\", \"fatherMiddleName\": \"Calatay\", \"motherMiddleName\": \"Cruz\"}',NULL,'2025-06-05 17:49:00.201333','2025-06-05 17:49:30.000000'),('BC-984013',5,'Birth Certificate','Copy of Birth Certificate','Pending','Application submitted with all required documents','{\"city\": \"San Ildefonso\", \"purpose\": \"Marriage License\", \"birthDay\": \"15\", \"lastName\": \"Wagan\", \"province\": \"Bulacan\", \"birthYear\": \"2003\", \"firstName\": \"Karlo Robert\", \"birthMonth\": \"January\", \"middleName\": \"Castro\", \"isCopyRequest\": true, \"fatherLastName\": \"Wagan\", \"motherLastName\": \"Castro\", \"fatherFirstName\": \"Roberto\", \"motherFirstName\": \"Erlinda\", \"fatherMiddleName\": \"Calatay\", \"motherMiddleName\": \"Cruz\"}',NULL,'2025-06-05 15:53:04.042593','2025-06-05 15:53:27.000000');
/*!40000 ALTER TABLE `document_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `document_files`
--

DROP TABLE IF EXISTS `document_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `document_files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `application_id` varchar(50) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_type` varchar(100) NOT NULL,
  `file_size` bigint NOT NULL,
  `minio_object_name` varchar(500) NOT NULL,
  `document_category` varchar(100) DEFAULT NULL,
  `uploaded_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `IDX_3b4d2bc8f7ee8198a0025a7df0` (`document_category`),
  KEY `IDX_256f35d4a641ac496bedd1368c` (`application_id`),
  CONSTRAINT `FK_256f35d4a641ac496bedd1368ca` FOREIGN KEY (`application_id`) REFERENCES `document_applications` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document_files`
--

LOCK TABLES `document_files` WRITE;
/*!40000 ALTER TABLE `document_files` DISABLE KEYS */;
INSERT INTO `document_files` VALUES (19,'BC-079011','wuthering-waves.jpg','image/jpeg',28134,'applications/BC-079011/Valid ID/1749045090181_wuthering-waves.jpg','Valid ID','2025-06-04 21:51:30.195166'),(20,'BC-079011','Screenshot 2025-05-16 213341.png','image/png',9939,'applications/BC-079011/Authorization Letter (if applicable)/1749045094962_Screenshot 2025-05-16 213341.png','Authorization Letter (if applicable)','2025-06-04 21:51:34.972593'),(21,'BC-906303','download (1).jpg','image/jpeg',122890,'applications/BC-906303/Valid ID/1749046915962_download (1).jpg','Valid ID','2025-06-04 22:21:55.982950'),(22,'BC-906303','Screenshot 2025-05-16 222440.png','image/png',1268957,'applications/BC-906303/Authorization Letter (if applicable)/1749046935360_Screenshot 2025-05-16 222440.png','Authorization Letter (if applicable)','2025-06-04 22:22:15.386574'),(23,'BC-443912','Viola.jpg','image/jpeg',64486,'applications/BC-443912/Valid ID/1749048449537_Viola.jpg','Valid ID','2025-06-04 22:47:29.586930'),(24,'BC-443912','Screenshot 2025-05-16 212903.png','image/png',721180,'applications/BC-443912/Authorization Letter (if applicable)/1749048454850_Screenshot 2025-05-16 212903.png','Authorization Letter (if applicable)','2025-06-04 22:47:34.879228'),(25,'BC-984013','Screenshot 2025-05-16 222440.png','image/png',1268957,'applications/BC-984013/Valid ID/1749110000501_Screenshot 2025-05-16 222440.png','Valid ID','2025-06-05 15:53:20.527681'),(26,'BC-984013','Screenshot 2025-05-16 213341.png','image/png',9939,'applications/BC-984013/Authorization Letter (if applicable)/1749110005074_Screenshot 2025-05-16 213341.png','Authorization Letter (if applicable)','2025-06-05 15:53:25.086295'),(27,'BC-940171','download (1).jpg','image/jpeg',122890,'applications/BC-940171/Valid ID/1749116963556_download (1).jpg','Valid ID','2025-06-05 17:49:23.569703'),(28,'BC-940171','Screenshot 2025-05-16 213341.png','image/png',9939,'applications/BC-940171/Authorization Letter (if applicable)/1749116968569_Screenshot 2025-05-16 213341.png','Authorization Letter (if applicable)','2025-06-05 17:49:28.577977'),(29,'BC-059300','Screenshot_2025-03-07-10-26-00-138_com.miui.gallery.jpg','image/jpeg',1010454,'applications/BC-059300/Valid ID/1749118065473_Screenshot_2025-03-07-10-26-00-138_com.miui.gallery.jpg','Valid ID','2025-06-05 18:07:45.505242'),(30,'BC-059300','Screenshot 2025-05-16 213652.png','image/png',139288,'applications/BC-059300/Authorization Letter (if applicable)/1749118069491_Screenshot 2025-05-16 213652.png','Authorization Letter (if applicable)','2025-06-05 18:07:49.510582');
/*!40000 ALTER TABLE `document_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `queue_details`
--

DROP TABLE IF EXISTS `queue_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `queue_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `queue_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `reason_of_visit` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `middle_initial` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `appointment_type` varchar(255) NOT NULL,
  `is_guest` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_queue_id` (`queue_id`),
  KEY `fk_user_id` (`user_id`),
  CONSTRAINT `fk_queue_id` FOREIGN KEY (`queue_id`) REFERENCES `queues` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `queue_details`
--

LOCK TABLES `queue_details` WRITE;
/*!40000 ALTER TABLE `queue_details` DISABLE KEYS */;
INSERT INTO `queue_details` VALUES (39,45,3,'0681, Purok Bagong Barrio','Marriage Certificate','Karlo Robert','Wagan','C','09429839234','Marriage Certificate',0),(40,46,3,'0681, Purok Bagong Barrio','Birth Certificate','Karlo Robert','Wagan','C','09429839234','Birth Certificate',0),(41,47,5,'Bagong Barrio','Birth Certificate','Karlo Robert','Wagan','Castro','09425678912','Birth Certificate',0),(42,48,5,'0681, Purok Bagong Barrio','Death Certificate','Karlo Robert','Wagan','C','09429839234','Death Certificate',0),(43,49,5,'0681, Purok Bagong Barrio','Marriage Certificate','Karlo Robert','Wagan','C','09429839234','Marriage Certificate',0),(44,50,5,'et4','Marriage Certificate','Karlo Robert','Wagan','Castro','09425678912','Marriage Certificate',0),(45,51,3,'0681, Purok Bagong Barrio','Marriage Certificate','Karlo Robert','Wagan','C','09429839234','Marriage Certificate',0);
/*!40000 ALTER TABLE `queue_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `queues`
--

DROP TABLE IF EXISTS `queues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `queues` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` enum('pending','serving','completed','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `completed_at` datetime DEFAULT NULL,
  `estimated_wait_time` int DEFAULT NULL,
  `queue_number` varchar(255) NOT NULL,
  `counter_number` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_9d936a491c2462a7025c841a17` (`queue_number`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `queues`
--

LOCK TABLES `queues` WRITE;
/*!40000 ALTER TABLE `queues` DISABLE KEYS */;
INSERT INTO `queues` VALUES (45,'pending','2025-06-06 14:12:12.014531',NULL,15,'20250606-0001',NULL),(46,'pending','2025-06-06 14:13:25.827311',NULL,30,'20250606-0002',NULL),(47,'pending','2025-06-06 14:15:18.349130',NULL,45,'20250606-0003',NULL),(48,'pending','2025-06-06 14:19:00.637803',NULL,60,'20250606-0004',NULL),(49,'pending','2025-06-06 14:21:33.129444',NULL,75,'20250606-0005',NULL),(50,'pending','2025-06-06 14:28:46.207850',NULL,90,'20250606-0006',NULL),(51,'pending','2025-06-06 14:29:21.095564',NULL,105,'20250606-0007',NULL);
/*!40000 ALTER TABLE `queues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_648e3f5447f725579d7d4ffdfb` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Has all permissions and can manage other admins','super_admin'),(2,'Can manage staff and citizens','admin'),(3,'Can process applications and manage citizen requests','staff'),(4,'Regular user of the system','citizen');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `IDX_87b8888186ca9769c960e92687` (`user_id`),
  KEY `IDX_b23c65e50a758245a33ee35fda` (`role_id`),
  CONSTRAINT `FK_87b8888186ca9769c960e926870` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_b23c65e50a758245a33ee35fda1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (3,4),(5,4),(6,2),(7,1),(8,3);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `default_role_id` int DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `name_extension` varchar(255) DEFAULT NULL,
  `contact_number` varchar(255) DEFAULT NULL,
  `is_active` tinyint NOT NULL DEFAULT '1',
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`),
  UNIQUE KEY `IDX_fe0bb3f6520ee0469504521e71` (`username`),
  KEY `FK_2fb360b97dd407361f763e9c463` (`default_role_id`),
  CONSTRAINT `FK_2fb360b97dd407361f763e9c463` FOREIGN KEY (`default_role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'test@example.com','test','$2b$10$iIou9eUq7VHJEloIyItGJOrt9B6ykW6h5ZGuGTjzyFHE9ZT41i7Qm','Test User','2025-04-14 20:56:08.248933',4,'',NULL,'',NULL,NULL,1,'2025-06-06 15:30:53.074992'),(5,'meee@meee.com','meee','$2b$10$KB62CK3vioFk5so8k56EqO0Sl1Q0V8mQxGUieWvzt2947pprP2bnm','Karlo Robert Castro Wagan','2025-04-14 20:56:08.248933',4,'Karlo Robert','Castro','Wagan',NULL,'09425678912',1,'2025-06-06 15:30:53.074992'),(6,'admin@example.com','admin','$2b$10$oFpTU0U73YZPA.szNm2UHe22GtJY6k3yrGi2qa3txYzOD7EG2h.hq','Admin User','2025-04-15 21:09:29.718738',2,'',NULL,'',NULL,NULL,1,'2025-06-06 15:30:53.074992'),(7,'superadmin@example.com','superadmin','$2b$10$oFpTU0U73YZPA.szNm2UHe22GtJY6k3yrGi2qa3txYzOD7EG2h.hq','Super Admin User','2025-04-15 21:09:29.724504',1,'',NULL,'',NULL,NULL,1,'2025-06-06 15:30:53.074992'),(8,'staff@example.com','staff','$2b$10$oFpTU0U73YZPA.szNm2UHe22GtJY6k3yrGi2qa3txYzOD7EG2h.hq','Staff User','2025-04-15 21:09:29.729303',3,'',NULL,'',NULL,NULL,1,'2025-06-06 15:30:53.074992');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'bulak_smart_connect'
--

--
-- Dumping routines for database 'bulak_smart_connect'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-06 15:41:57
