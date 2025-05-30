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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcements`
--

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
INSERT INTO `announcements` VALUES (1,'Helpp','Sheeesh','',1,'admin','2025-05-25 23:10:50.798080','2025-05-25 23:10:50.798080'),(2,'Hiiii','Helllo','',1,'admin','2025-05-25 23:17:00.180311','2025-05-25 23:17:00.180311'),(3,'HEEEEE','hgfrjhrfgjrtgjtjtghjtyjtyjtyjtyjtyjtyjtyjty','',1,'admin','2025-05-26 01:02:05.360060','2025-05-26 01:02:05.360060'),(4,'bfbfbfbfbrfg','fbfgbgfbgfbgfbgfbfgbfgbgfbgfbgfbgfbgfbfgbfgbfgbfgbgfbgfbfgbgbgf','',1,'admin','2025-05-26 01:07:40.458899','2025-05-26 01:07:40.458899'),(5,'Nya Nya','Nyaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','',1,'admin','2025-05-26 01:29:36.005692','2025-05-26 03:45:53.000000');
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
  `changed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_application_id` (`application_id`),
  KEY `idx_changed_at` (`changed_at`),
  CONSTRAINT `application_status_history_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `document_applications` (`id`) ON DELETE CASCADE
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES (1,'123 Main St, Evetywhere, Bulacan','Marriage Certificate','2025-05-27','pending',NULL,0,'2025-05-25 00:27:57.890578','2025-05-25 00:27:57.890578','APPT-20250527-3872','Luan','Francisco','D','09124458403','13:00 PM - 13:30 PM'),(2,'123 Main St, Evetywhere, Bulacan','Marriage Certificate','2025-05-26','pending',NULL,0,'2025-05-25 17:43:03.800082','2025-05-25 17:43:03.800082','APPT-20250526-9941','Luan','Francisco','D','09124458403','13:00 PM - 13:30 PM');
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
  `status` enum('Pending','Processing','Approved','Rejected','Ready for Pickup') DEFAULT 'Pending',
  `status_message` text,
  `form_data` json NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`application_type`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document_applications`
--

LOCK TABLES `document_applications` WRITE;
/*!40000 ALTER TABLE `document_applications` DISABLE KEYS */;
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
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_application_id` (`application_id`),
  KEY `idx_document_category` (`document_category`),
  CONSTRAINT `document_files_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `document_applications` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document_files`
--

LOCK TABLES `document_files` WRITE;
/*!40000 ALTER TABLE `document_files` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `queue_details`
--

LOCK TABLES `queue_details` WRITE;
/*!40000 ALTER TABLE `queue_details` DISABLE KEYS */;
INSERT INTO `queue_details` VALUES (18,22,NULL,'drgh','Birth Certificate','Karlo Robert','Wagan','Castro','09425678912','Birth Certificate',1),(19,23,NULL,'0','Marriage Certificate','Karlo Robert','Wagan','C','09123456789','Marriage Certificate',1),(20,24,NULL,'hgkghk','Marriage Certificate','Karlo Robert','Wagan','Castro','09425678912','Marriage Certificate',1),(21,25,NULL,'dfasdas','Marriage Certificate','Dennisse Gail','Francisco','R','1147','Marriage Certificate',1),(22,28,NULL,'hhhu','Marriage Certificate','Karlo Robert','Wagan','Castro','09425678912','Marriage Certificate',1),(23,29,NULL,'sdsdsdf','Marriage Certificate','Karlo Robert','Wagan','Castro','09425678912','Marriage Certificate',1),(24,30,NULL,'sdfsdf','Marriage Certificate','Karlo Robert','Wagan','Castro','09425678912','Marriage Certificate',1),(25,31,NULL,'gdfgfd','Marriage Certificate','Karlo Robert','Wagan','Castro','09425678912','Marriage Certificate',1),(26,32,NULL,'adasd','Marriage Certificate','Karlo Robert','Wagan','Castro','09425678912','Marriage Certificate',1),(27,33,NULL,'gdfgfgd','Marriage Certificate','Karlo Robert','Wagan','Castro','09425678912','Marriage Certificate',1),(28,34,NULL,'gdfgfdfd','Birth Certificate','Karlo Robert','Wagan','Castro','09425678912','Birth Certificate',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `queues`
--

LOCK TABLES `queues` WRITE;
/*!40000 ALTER TABLE `queues` DISABLE KEYS */;
INSERT INTO `queues` VALUES (22,'completed','2025-05-21 20:56:09.083663','2025-05-22 16:46:30',15,'20250521-0001',NULL),(23,'completed','2025-05-21 20:56:51.649146','2025-05-22 17:35:00',30,'20250521-0002',NULL),(24,'completed','2025-05-21 21:05:15.540549','2025-05-22 17:37:03',45,'20250521-0003',NULL),(25,'completed','2025-05-21 21:05:54.591511','2025-05-22 17:37:15',60,'20250521-0004',NULL),(26,'completed','2025-05-21 22:26:25.554549','2025-05-23 23:16:08',75,'20250521-0005',NULL),(27,'completed','2025-05-21 22:26:34.115183','2025-05-23 23:16:22',90,'20250521-0006',NULL),(28,'completed','2025-05-22 16:54:49.749023','2025-05-22 16:55:37',105,'20250522-0007',NULL),(29,'completed','2025-05-22 17:36:51.631345','2025-05-22 17:38:14',120,'20250522-0008',NULL),(30,'completed','2025-05-24 01:24:03.853258','2025-05-24 01:24:38',135,'20250524-0009',NULL),(31,'completed','2025-05-24 01:40:36.637108','2025-05-24 01:41:15',150,'20250524-0010',NULL),(32,'completed','2025-05-24 01:42:09.943996','2025-05-24 01:43:44',165,'20250524-0011',NULL),(33,'completed','2025-05-24 01:42:32.037952','2025-05-24 01:43:46',180,'20250524-0012',NULL),(34,'pending','2025-05-24 01:42:46.756709',NULL,195,'20250524-0013',NULL);
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
INSERT INTO `users` VALUES (3,'test@example.com','test','$2b$10$iIou9eUq7VHJEloIyItGJOrt9B6ykW6h5ZGuGTjzyFHE9ZT41i7Qm','Test User','2025-04-14 20:56:08.248933',4,'',NULL,'',NULL,NULL),(5,'meee@meee.com','meee','$2b$10$KB62CK3vioFk5so8k56EqO0Sl1Q0V8mQxGUieWvzt2947pprP2bnm','Karlo Robert Castro Wagan','2025-04-14 20:56:08.248933',4,'Karlo Robert','Castro','Wagan',NULL,'09425678912'),(6,'admin@example.com','admin','$2b$10$oFpTU0U73YZPA.szNm2UHe22GtJY6k3yrGi2qa3txYzOD7EG2h.hq','Admin User','2025-04-15 21:09:29.718738',2,'',NULL,'',NULL,NULL),(7,'superadmin@example.com','superadmin','$2b$10$oFpTU0U73YZPA.szNm2UHe22GtJY6k3yrGi2qa3txYzOD7EG2h.hq','Super Admin User','2025-04-15 21:09:29.724504',1,'',NULL,'',NULL,NULL),(8,'staff@example.com','staff','$2b$10$oFpTU0U73YZPA.szNm2UHe22GtJY6k3yrGi2qa3txYzOD7EG2h.hq','Staff User','2025-04-15 21:09:29.729303',3,'',NULL,'',NULL,NULL);
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

-- Dump completed on 2025-05-27 19:27:19
