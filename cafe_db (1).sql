-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 06, 2024 at 09:20 AM
-- Server version: 8.3.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cafe_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total`, `status`, `created_at`) VALUES
(16, 1, 2.50, 'paid', '2024-09-28 15:53:11'),
(15, 1, 2.50, 'paid', '2024-09-28 15:47:55'),
(17, 2, 2.50, 'paid', '2024-09-29 22:25:13'),
(18, 2, 8.50, 'paid', '2024-09-29 22:44:44'),
(19, 2, 7.50, 'paid', '2024-09-30 01:05:31'),
(23, 2, 2.50, 'paid', '2024-09-30 01:31:38'),
(21, 2, 2.50, 'paid', '2024-09-30 01:06:44'),
(22, 2, 2.50, 'paid', '2024-09-30 01:11:03'),
(24, 2, 3.75, 'paid', '2024-09-30 01:31:46'),
(25, 2, 2.50, 'paid', '2024-09-30 01:54:04'),
(26, 2, 2.50, 'paid', '2024-09-30 01:57:23'),
(27, 2, 2.50, 'paid', '2024-09-30 01:59:27'),
(31, 2, 2.50, 'paid', '2024-09-30 02:17:37'),
(29, 2, 2.50, 'paid', '2024-09-30 02:07:30'),
(30, 2, 2.50, 'paid', '2024-09-30 02:16:38'),
(32, 2, 2.50, 'paid', '2024-09-30 02:48:33'),
(33, 2, 2.50, 'paid', '2024-09-30 02:50:00'),
(34, 2, 2.50, 'paid', '2024-09-30 05:38:09'),
(35, 2, 2.50, 'paid', '2024-10-01 12:35:56'),
(36, 2, 3.50, 'paid', '2024-10-01 14:50:00'),
(37, 2, 7.00, 'paid', '2024-10-01 17:07:16'),
(40, 4, 3.00, 'paid', '2024-10-01 23:49:15'),
(39, 2, 7.00, 'paid', '2024-10-01 17:10:40'),
(41, 4, 3.75, 'paid', '2024-10-02 00:49:49'),
(42, 4, 7.50, 'paid', '2024-10-02 12:46:18'),
(43, 4, 3.50, 'paid', '2024-10-02 12:55:20'),
(44, 1, 1.13, 'paid', '2024-10-02 13:18:59'),
(45, 1, 7.25, 'paid', '2024-10-02 13:45:01'),
(46, 4, 3.50, 'paid', '2024-10-02 14:16:24');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`)
) ENGINE=MyISAM AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`) VALUES
(22, 16, 1, 1),
(21, 15, 1, 1),
(20, 14, 6, 1),
(19, 13, 1, 1),
(18, 12, 1, 1),
(17, 11, 1, 1),
(16, 10, 1, 1),
(15, 9, 1, 1),
(14, 9, 1, 1),
(23, 17, 1, 1),
(24, 18, 1, 1),
(25, 18, 2, 1),
(26, 18, 1, 1),
(27, 19, 1, 1),
(28, 19, 1, 1),
(29, 19, 1, 1),
(30, 20, 1, 1),
(31, 21, 1, 1),
(32, 22, 1, 1),
(33, 23, 1, 1),
(34, 24, 3, 1),
(35, 25, 1, 1),
(36, 26, 1, 1),
(37, 27, 1, 1),
(38, 28, 1, 1),
(39, 29, 1, 1),
(40, 30, 1, 1),
(41, 31, 1, 1),
(42, 32, 1, 1),
(43, 33, 1, 1),
(44, 34, 1, 1),
(45, 35, 1, 1),
(46, 36, 10, 1),
(47, 37, 11, 2),
(48, 38, 11, 1),
(49, 39, 11, 1),
(50, 39, 11, 1),
(51, 40, 16, 1),
(52, 41, 12, 1),
(53, 42, 12, 1),
(54, 42, 12, 1),
(55, 43, 11, 1),
(56, 44, 19, 1),
(57, 45, 11, 1),
(58, 45, 12, 1),
(59, 46, 11, 1);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `price` decimal(10,2) NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `image_path`) VALUES
(1, 'Latte', 'Espresso with steamed milk.', 3.50, 'uploads\\1727800981065-XÃ­cara de capuccino de cafÃ© quente com latte art na mesa de madeira no cafÃ© _ Foto Premium.jpg'),
(2, 'Cappucino', 'Espresso with steamed milk and foam.', 3.75, 'uploads\\1727801144743-download (3).jpg'),
(3, 'Mocha', 'Espresso with chocolate and steamed milk.', 4.00, 'uploads\\1727801234271-download (4).jpg'),
(4, 'Tea', 'Assorted herbal teas.', 2.00, 'uploads\\1727801475219-English Tea stock image_ Image of leaf, food, glass, liquid - 22614347.jpg'),
(5, 'Black Coffe', 'Kapeng matapang', 1.00, 'uploads\\1727801621417-Black-Coffee.jpg'),
(6, 'Americano', 'Espresso diluted with hot water for a milder taste', 3.00, 'uploads\\1727801782965-OIP.jpg'),
(7, 'Iced Coffe', 'Brewed coffee served over ice with milk or sweeten.', 3.50, 'uploads\\1727801900475-OIP (1).jpg');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES
(1, 'Daryl', 'aash100227@gmail.com', '$2a$10$iywiduheonzWxSXV0RJ3BevJNgxNcBCzXSualiAlf9r5qmPtGJBay'),
(2, 'alfia', 'alfiaaronbahia07@gmail.com', '$2a$10$KLB2k3qvo5UlGaKVQBQGA.aRKCrcHkw6FXk4KOcQ/DoNzAHdNCVIy'),
(3, 'lala', 'alfia@gmail.com', '$2a$10$j2SAt9Zo/0fAQq4C3YwnDuutTnhCJzeYBqjbQGtHzMHY8j7CAi21a'),
(4, 'lala', 'alfia07@gmail.com', '$2a$10$XmFfl4cmfUqzesVI2B9pwexO0a5J9x73kC8NpwC5c9KtTgAZxuN.C');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
