SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';
SET GLOBAL event_scheduler = ON;

-- 1. Borrar la base de datos si existe
DROP DATABASE IF EXISTS gimnastic;
CREATE DATABASE gimnastic;
USE gimnastic;

-- 2. Configuración de usuario de DB (Restricción de privilegios)
-- Primero creamos la identidad (si no existe)
CREATE USER IF NOT EXISTS 'adminDB'@'localhost' IDENTIFIED BY 'adminDB';

-- Luego asignamos los permisos específicos
-- Arquitectura de seguridad conocida como el "Principio de Menor Privilegio"
-- Aplicamos SELECT para lectura y EXECUTE para poder invocar los Stored Procedures.
-- Esto impide INSERT, UPDATE y DELETE directos desde el código de la aplicación.
GRANT SELECT, EXECUTE ON gimnastic.* TO 'adminDB'@'localhost';

-- 3. Tabla de Roles (Normalización)
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
);

-- 4. Tabla de Usuarios (Sin el campo role ENUM)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    user_activity VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla Intermedia: users_roles (Relación Muchos a Muchos)
CREATE TABLE users_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- 6. Tabla de Alumnos
CREATE TABLE alumns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    alumn_name VARCHAR(100) NOT NULL,
    alumn_age INT NOT NULL,
    alumn_level VARCHAR(50) NOT NULL,
    alumn_activity ENUM('admin','Gimnasia','Acrodanza') NOT NULL,
    phone VARCHAR(20) NOT NULL,
    alumn_group VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de teachers
CREATE TABLE teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    teacher_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Inserción de Datos Maestros (Roles)
INSERT INTO roles (name) VALUES ('admin'), ('school');

-- 8. Datos de prueba iniciales
-- Usuario 'admin' (pass: 12345)
INSERT INTO users (id, username, user_activity, password) VALUES (1, 'admin','admin', '$2b$10$.n0s847tiSxBqDvIo6Vg5ujXC5zIUmm98bTjBWnRdqX9CxxbIo7wS');
INSERT INTO users_roles (user_id, role_id) VALUES (1, 1); -- Rol Admin

-- Usuario 'Gimnasia' (pass: 12345)
INSERT INTO users (id, username, user_activity, password) VALUES (2, 'Gymnastic', 'Gimnasia','$2b$10$.n0s847tiSxBqDvIo6Vg5ujXC5zIUmm98bTjBWnRdqX9CxxbIo7wS');
INSERT INTO users_roles (user_id, role_id) VALUES (2, 2); -- Rol school

-- Insercion de profesores
INSERT INTO teachers (user_id, teacher_name) VALUES
(2, 'Ludmila'),
(2, 'Messi');

-- Datos de prueba

INSERT INTO alumns (user_id, alumn_name, alumn_age, alumn_level, alumn_activity, phone, alumn_group) VALUES
(2, 'Lucas Martínez', 15, '2', 'Gimnasia', '+541123456789', 'Ludmila'),
(2, 'Sofía Rodríguez', 14, '3', 'Gimnasia', '+541198765432', 'Ludmila'),
(3, 'Mateo Benítez', 16, '3', 'Gimnasia', '+541133445566', 'Messi'),
(4, 'Valentina Flores', 15, '2', 'Gimnasia', '+541155667788', 'Ludmila'),
(4, 'Santiago Gómez', 12, '1', 'Gimnasia', '+541177889900', 'Messi'),
(2, 'Mia Carrizo', 11, '7', 'Gimnasia', '+541122334455', 'Messi'),
(2, 'Thiago Silva', 12, '7', 'Gimnasia', '+541166778899', 'Ludmila'),
(2, 'Emma Pereyra', 17, '9', 'Gimnasia', '+541144556677', 'Messi');

-- ==========================================================
-- 9. PROCEDIMIENTOS ALMACENADOS (Stored Procedures)
-- ==========================================================

DELIMITER //

-- --- PROCEDIMIENTOS PARA USERS ---

-- Buscar usuario por username (con su rol)
CREATE PROCEDURE sp_find_user_by_username(IN p_username VARCHAR(50))
BEGIN
    SELECT u.*, r.name as role 
    FROM users u
    JOIN users_roles ur ON u.id = ur.user_id
    JOIN roles r ON ur.role_id = r.id
    WHERE u.username = p_username;
END //

-- Buscar usuario por actividad (con su rol)
CREATE PROCEDURE sp_find_user_by_activity(IN p_activity VARCHAR(50))
BEGIN
    SELECT u.*, r.name as role 
    FROM users u
    JOIN users_roles ur ON u.id = ur.user_id
    JOIN roles r ON ur.role_id = r.id
    WHERE u.user_activity = p_activity;
END //

-- Crear nuevo usuario y asignar rol por nombre
CREATE PROCEDURE sp_create_user(
    IN p_username VARCHAR(50), 
    IN p_user_activity VARCHAR(20),
    IN p_password VARCHAR(255), 
    IN p_role_name VARCHAR(20)
)
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_role_id INT;

    INSERT INTO users (username, user_activity, password) VALUES (p_username,p_user_activity, p_password);
    SET v_user_id = LAST_INSERT_ID();

    SELECT id INTO v_role_id FROM roles WHERE name = p_role_name;
    INSERT INTO users_roles (user_id, role_id) VALUES (v_user_id, v_role_id);
    
    SELECT v_user_id as insertId;
END //

-- Listar todos los usuarios
CREATE PROCEDURE sp_find_all_users()
BEGIN
    SELECT u.id, u.username, r.name as role, u.created_at 
    FROM users u
    JOIN users_roles ur ON u.id = ur.user_id
    JOIN roles r ON ur.role_id = r.id;
END //

-- Borrar usuario
CREATE PROCEDURE sp_delete_user(IN p_id INT)
BEGIN
    DELETE FROM users WHERE id = p_id;
END //

-- --- PROCEDIMIENTOS PARA ALUMNOS ---

-- Crear Alumno
DELIMITER //

CREATE PROCEDURE sp_create_alumn(
    IN p_user_id INT,
    IN p_alumn_name VARCHAR(100),
    IN p_alumn_group VARCHAR(50),
    IN p_alumn_level INT,
    IN p_alumn_age INT,
    IN p_alumn_activity VARCHAR(100),
    IN p_phone VARCHAR(20)
)
BEGIN
    INSERT INTO alumns (user_id, alumn_name, alumn_group, alumn_level, alumn_age, alumn_activity, phone)
    VALUES (p_user_id, p_alumn_name, p_alumn_group, p_alumn_level, p_alumn_age, p_alumn_activity, p_phone);
    
    SELECT LAST_INSERT_ID() as insertId;
END //

-- Listar alumns por usuario
CREATE PROCEDURE sp_find_alumns_by_user(IN p_user_id INT)
BEGIN
    SELECT * FROM alumns WHERE user_id = p_user_id;
END //

-- Buscar alumn específico (Validando dueño)
CREATE PROCEDURE sp_find_alumn_by_id(IN p_id INT, IN p_user_id INT)
BEGIN
    SELECT * FROM alumns WHERE id = p_id AND user_id = p_user_id;
END //

-- Buscar alumn por filtro validando dueño
CREATE PROCEDURE sp_find_alumns_by_filter(IN p_alumn_group VARCHAR(50), IN p_alumn_level INT, IN p_user_id INT)
BEGIN  
    SELECT * FROM alumns 
    WHERE user_id = p_user_id
      -- Filtro de Grupo: Si es null, 'null' o vacío, da TRUE (ignora el filtro). Si tiene valor, filtra.
      AND (p_alumn_group IS NULL OR p_alumn_group = 'null' OR p_alumn_group = '' OR alumn_group = p_alumn_group)
      
      AND (p_alumn_level = 0 OR p_alumn_level = 'null' OR p_alumn_level = '' OR alumn_level = p_alumn_level);

END //

-- Borrar alumn (Validando dueño)
CREATE PROCEDURE sp_delete_alumn(IN p_id INT, IN p_user_id INT)
BEGIN
    DELETE FROM alumns WHERE id = p_id AND user_id = p_user_id;
END //


-- Actualizar nivel de un alumno específico
CREATE PROCEDURE sp_update_level(IN p_id INT, IN p_user_id INT, IN p_new_level INT)
BEGIN
    UPDATE alumns 
    SET alumn_level = p_new_level
    WHERE id = p_id AND user_id = p_user_id;
END //

-- Actualizar grupo de un alumno específico
CREATE PROCEDURE sp_update_group(IN p_id INT, IN p_user_id INT, IN p_new_group VARCHAR(20))
BEGIN
    UPDATE alumns 
    SET alumn_group = p_new_group
    WHERE id = p_id AND user_id = p_user_id;
END //

-- Obtener grupos disponibles por userid
CREATE PROCEDURE sp_get_groups_by_user(IN p_user_id INT)
BEGIN
    SELECT DISTINCT teacher_name FROM teachers WHERE user_id = p_user_id;
END //



DELIMITER ;
SET foreign_key_checks = 1;