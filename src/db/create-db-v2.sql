CREATE USER 'groupomania'@'localhost' IDENTIFIED BY 'group8546';
GRANT ALL PRIVILEGES ON groupomania.* TO 'groupomania'@'localhost';

DROP DATABASE IF EXISTS groupomania; 

CREATE DATABASE groupomania CHARACTER SET 'utf8';

DROP TABLE IF EXISTS `groupomania`.`users`; 

CREATE TABLE IF NOT EXISTS `groupomania`.`users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(128) NOT NULL,
  `username` VARCHAR(45) NULL,
  `user_creation_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `role` VARCHAR(5) NOT NULL DEFAULT 'user',
  `avatar_url` TEXT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) INVISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE)
ENGINE = InnoDB;

DROP TABLE IF EXISTS `groupomania`.`posts`; 

CREATE TABLE IF NOT EXISTS `groupomania`.`posts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `author_id` INT UNSIGNED NOT NULL,
  `creation_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `likes` INT UNSIGNED NOT NULL,
  `dislikes` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `post_id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `author_id_idx` (`author_id` ASC) VISIBLE,
  CONSTRAINT `author_id`
    FOREIGN KEY (`author_id`)
    REFERENCES `groupomania`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

DROP TABLE IF EXISTS `groupomania`.`post_likes`; 

CREATE TABLE IF NOT EXISTS `groupomania`.`post_likes` (
  `post_likes_pk` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `post_id` INT UNSIGNED NOT NULL,
  `likes_status` TINYINT NULL,
  `dislikes_status` TINYINT NULL,
  INDEX `post_id_idx` (`post_id` ASC) VISIBLE,
  PRIMARY KEY (`post_likes_pk`),
  CONSTRAINT `user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `groupomania`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `post_id`
    FOREIGN KEY (`post_id`)
    REFERENCES `groupomania`.`posts` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

DROP TABLE IF EXISTS `groupomania`.`comments`; 

CREATE TABLE IF NOT EXISTS `groupomania`.`comments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `author_id` INT UNSIGNED NOT NULL,
  `post_id` INT UNSIGNED NOT NULL,
  `text` MEDIUMTEXT NOT NULL,
  `creation_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `comment_user_id_idx` (`author_id` ASC) VISIBLE,
  INDEX `post_id_idx` (`post_id` ASC) VISIBLE,
  CONSTRAINT `comment_author_id`
    FOREIGN KEY (`author_id`)
    REFERENCES `groupomania`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `comment_post_id`
    FOREIGN KEY (`post_id`)
    REFERENCES `groupomania`.`posts` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;