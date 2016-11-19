-- phpMyAdmin SQL Dump
-- version 4.5.5.1
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1
-- Время создания: Ноя 19 2016 г., 11:06
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

--
-- Дамп данных таблицы `classrooms`
--

INSERT INTO `classrooms` (`idClassRoom`, `descriptionClassRoom`, `cityClassRoom`, `addressClassRoom`, `numerClassRoom`, `numberPlaces`) VALUES
(1, 'telran', 'Rekhovot', 'Paul 10', '1', 50),
(2, 'telran', 'Rekhovot', 'Paul 10', '2', 50),
(3, 'telran', 'Rekhovot', 'Paul 10', '3', 50),
(4, 'moadon', 'Ashkelon', 'bc 209', '4', 50);

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

--
-- Дамп данных таблицы `courses`
--

INSERT INTO `courses` (`idCourse`, `descriptionCourse`, `idSubject`, `idGroup`, `idUserTeacher`, `daysToStudy`) VALUES
(1, 'MASA', 1, 1, 7, 99),
(2, 'TELRAN', 1, 2, 7, 99),
(3, 'TAGLIT', 2, 2, 8, 91);

-- --------------------------------------------------------

--
-- Структура таблицы `groups`
--

CREATE TABLE `groups` (
  `idGroup` int(11) NOT NULL,
  `nameGroup` varchar(32) COLLATE utf8_bin NOT NULL,
  `descriptionGroup` varchar(1024) COLLATE utf8_bin NOT NULL,
  `grpupStatus` enum('learning','featured','graduated') COLLATE utf8_bin NOT NULL,
  `startStudy` date NOT NULL,
  `endStudy` date NOT NULL,
  `idUserSteward` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Дамп данных таблицы `groups`
--

INSERT INTO `groups` (`idGroup`, `nameGroup`, `descriptionGroup`, `grpupStatus`, `startStudy`, `endStudy`, `idUserSteward`) VALUES
(1, 'masa', 'masa masyatskaya', 'learning', '2016-11-01', '2016-11-30', 0),
(2, 'telran', 'telransky', 'learning', '2016-11-01', '2016-11-30', 0),
(3, 'taglit', 'taglitdky', 'learning', '2016-11-01', '2016-11-30', 0);

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

--
-- Дамп данных таблицы `lessons`
--

INSERT INTO `lessons` (`idLesson`, `dateLesson`, `timeLesson`, `idCourse`, `idUserTeacherReplace`, `idClassRoom`) VALUES
(5, '2016-11-18', '20:00:00', 3, 0, 4),
(2, '2016-11-18', '08:00:00', 1, 0, 1),
(3, '2016-11-18', '12:00:00', 2, 0, 2),
(4, '2016-11-18', '17:00:00', 3, 0, 3),
(6, '2016-11-18', '04:00:00', 1, 0, 1),
(7, '2016-11-18', '11:00:00', 2, 0, 2);

-- --------------------------------------------------------

--
-- Структура таблицы `studentsingroups`
--

CREATE TABLE `studentsingroups` (
  `idStudentInGroup` int(11) NOT NULL,
  `idGroup` int(11) NOT NULL,
  `idUserStudent` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Дамп данных таблицы `studentsingroups`
--

INSERT INTO `studentsingroups` (`idStudentInGroup`, `idGroup`, `idUserStudent`) VALUES
(4, 3, 3),
(2, 1, 2),
(3, 2, 1),
(5, 2, 3);

-- --------------------------------------------------------

--
-- Структура таблицы `subjects`
--

CREATE TABLE `subjects` (
  `idSubject` int(11) NOT NULL,
  `nameSubject` varchar(32) COLLATE utf8_bin NOT NULL,
  `descriptionSubject` varchar(32) COLLATE utf8_bin NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Дамп данных таблицы `subjects`
--

INSERT INTO `subjects` (`idSubject`, `nameSubject`, `descriptionSubject`) VALUES
(1, 'java', 'java'),
(2, 'js', 'js');

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
  `currentToken` varchar(64) COLLATE utf8_bin NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`idUser`, `login`, `pass`, `name`, `lastName`, `accessLevel`, `passportID`, `address`, `telephone`, `eMail`, `currentToken`) VALUES
(1, 'user1', '1a1dc91c907325c69271ddf0c944bc72', 'wtf', 'orly', 'student', '', '', '', '', '24BkCLVyGuTiTaLXAqTI8y3MZP7yWzPB'),
(2, 'user2', '1a1dc91c907325c69271ddf0c944bc72', '', '', 'student', '100500', '', '', '', 'impoo0sCtZd458qgfjVCWSw6PKUtdDR6'),
(3, 'user3', '1a1dc91c907325c69271ddf0c944bc72', 'name', 'lastName', 'student', '123456789', 'br Cochba 209', '0503622641', 'student1@gmail.com', 'a83r9uYsXGQPmmz9w6FWGa6MYmcMJcqY'),
(4, 'user4', '1a1dc91c907325c69271ddf0c944bc72', 'name', 'lastName', 'student', '1234567891', 'br Cochba 209', '05036226411', 'student11@gmail.com', 'йцу'),
(7, 'teacher', '1a1dc91c907325c69271ddf0c944bc72', 'Aleksander', 'Sominsky', 'teacher', '123', 'Netania', '060', 'sominsky@mail.co.il', 'fUvJZc2YFQTDfgOCpwCaxt5Ug1HNhvkQ'),
(8, 'teacherJa', '1a1dc91c907325c69271ddf0c944bc72', 'Jakob', 'Milovich', 'teacher', '1231', 'Aphula', '0601', 'milovi4@mail.co.il', 'k3ItZTQMnN7H20xK7eaMBnEo4Hq8KU23');

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
  MODIFY `idClassRoom` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT для таблицы `courses`
--
ALTER TABLE `courses`
  MODIFY `idCourse` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT для таблицы `groups`
--
ALTER TABLE `groups`
  MODIFY `idGroup` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT для таблицы `lessons`
--
ALTER TABLE `lessons`
  MODIFY `idLesson` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT для таблицы `studentsingroups`
--
ALTER TABLE `studentsingroups`
  MODIFY `idStudentInGroup` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT для таблицы `subjects`
--
ALTER TABLE `subjects`
  MODIFY `idSubject` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `idUser` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
