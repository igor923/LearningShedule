-- phpMyAdmin SQL Dump
-- version 4.5.5.1
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1
-- Время создания: Ноя 18 2016 г., 10:38
-- Версия сервера: 5.7.11
-- Версия PHP: 5.6.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `learningscheduler`
--

-- --------------------------------------------------------

--
-- Структура таблицы `attendance`
--

CREATE TABLE `attendance` (
  `idAttendance` int(11) NOT NULL,
  `idLesson` int(11) NOT NULL,
  `idUserStudent` int(11) NOT NULL,
  `presence` enum('presence','absent','late') COLLATE utf8_bin NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Структура таблицы `classrooms`
--

CREATE TABLE `classrooms` (
  `idClassRoom` int(11) NOT NULL,
  `descriptionClassRoom` varchar(1024) COLLATE utf8_bin NOT NULL,
  `cityClassRoom` varchar(128) COLLATE utf8_bin NOT NULL,
  `addressClassRoom` varchar(1024) COLLATE utf8_bin NOT NULL,
  `numerClassRoom` varchar(8) COLLATE utf8_bin NOT NULL,
  `numberPlaces` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Структура таблицы `courses`
--

CREATE TABLE `courses` (
  `idCourse` int(11) NOT NULL,
  `descriptionCourse` varchar(1024) COLLATE utf8_bin NOT NULL,
  `idSubject` int(11) NOT NULL,
  `idGroup` int(11) NOT NULL,
  `idUserTeacher` int(11) NOT NULL,
  `daysToStudy` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Структура таблицы `groups`
--

CREATE TABLE `groups` (
  `idGroup` int(11) NOT NULL,
  `nameGroup` int(11) NOT NULL,
  `descriptionGroup` varchar(1024) COLLATE utf8_bin NOT NULL,
  `grpupStatus` enum('learning','featured','graduated') COLLATE utf8_bin NOT NULL,
  `startStudy` date NOT NULL,
  `endStudy` date NOT NULL,
  `idUserSteward` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Структура таблицы `lessons`
--

CREATE TABLE `lessons` (
  `idLesson` int(11) NOT NULL,
  `dateLesson` date NOT NULL,
  `timeLesson` time NOT NULL,
  `idCourse` int(11) NOT NULL,
  `idUserTeacherReplace` int(11) NOT NULL,
  `idClassRoom` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Структура таблицы `studentsingroups`
--

CREATE TABLE `studentsingroups` (
  `idStudentInGroup` int(11) NOT NULL,
  `idGroup` int(11) NOT NULL,
  `idUserStudent` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Структура таблицы `subjects`
--

CREATE TABLE `subjects` (
  `idSubject` int(11) NOT NULL,
  `nameSubject` int(11) NOT NULL,
  `descriptionSubject` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `idUser` int(10) UNSIGNED NOT NULL,
  `login` varchar(25) COLLATE utf8_bin NOT NULL,
  `pass` varchar(64) COLLATE utf8_bin DEFAULT NULL,
  `name` varchar(64) COLLATE utf8_bin NOT NULL,
  `lastName` varchar(64) COLLATE utf8_bin NOT NULL,
  `accessLevel` enum('student','teacher','admin') COLLATE utf8_bin NOT NULL,
  `passportID` varchar(25) COLLATE utf8_bin NOT NULL,
  `address` varchar(100) COLLATE utf8_bin NOT NULL,
  `telephone` varchar(16) COLLATE utf8_bin NOT NULL,
  `eMail` varchar(64) COLLATE utf8_bin NOT NULL,
  `currentToken` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`idAttendance`);

--
-- Индексы таблицы `classrooms`
--
ALTER TABLE `classrooms`
  ADD PRIMARY KEY (`idClassRoom`);

--
-- Индексы таблицы `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`idCourse`);

--
-- Индексы таблицы `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`idGroup`),
  ADD UNIQUE KEY `nameGroup` (`nameGroup`);

--
-- Индексы таблицы `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`idLesson`);

--
-- Индексы таблицы `studentsingroups`
--
ALTER TABLE `studentsingroups`
  ADD PRIMARY KEY (`idStudentInGroup`);

--
-- Индексы таблицы `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`idSubject`),
  ADD UNIQUE KEY `nameSubject` (`nameSubject`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`idUser`),
  ADD UNIQUE KEY `login` (`login`),
  ADD UNIQUE KEY `passportID` (`passportID`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `attendance`
--
ALTER TABLE `attendance`
  MODIFY `idAttendance` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `classrooms`
--
ALTER TABLE `classrooms`
  MODIFY `idClassRoom` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `courses`
--
ALTER TABLE `courses`
  MODIFY `idCourse` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `groups`
--
ALTER TABLE `groups`
  MODIFY `idGroup` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `lessons`
--
ALTER TABLE `lessons`
  MODIFY `idLesson` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `studentsingroups`
--
ALTER TABLE `studentsingroups`
  MODIFY `idStudentInGroup` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `subjects`
--
ALTER TABLE `subjects`
  MODIFY `idSubject` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `idUser` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
