-- DDL generated by Postico 2.0.5
-- Not all database features are supported. Do not use for backup.

-- Table Definition ----------------------------------------------

CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    address text,
    title text,
    sub_title text,
    keywords text,
    description text,
    modified_at timestamp without time zone,
    modified_by text
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX settings_pkey ON settings(id int4_ops);

INSERT INTO "public"."settings"("id","address","title","sub_title","keywords","description","modified_at","modified_by")
VALUES
(1,E'princelo.net',E'LamsCMS',E'Lams',E'Content Management System',E'Content Management System',E'2024-02-11 17:31:16',E'unknown');

-- DDL generated by Postico 2.0.5
-- Not all database features are supported. Do not use for backup.

-- Table Definition ----------------------------------------------

CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    title text,
    code text,
    type text,
    contains_content integer,
    hidden integer,
    list_page_template text,
    detail_page_template text,
    sort integer,
    parent_id integer
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX category_pkey ON category(id int4_ops);


-- DDL generated by Postico 2.0.5
-- Not all database features are supported. Do not use for backup.

-- Table Definition ----------------------------------------------

CREATE TABLE template (
    id SERIAL PRIMARY KEY,
    title text,
    type text,
    body text
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX template_pkey ON template(id int4_ops);

-- DDL generated by Postico 2.0.5
-- Not all database features are supported. Do not use for backup.

-- Table Definition ----------------------------------------------

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    role text,
    username text,
    password text,
    enabled integer
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX users_pkey ON users(id int4_ops);

-- DDL generated by Postico 2.0.5
-- Not all database features are supported. Do not use for backup.

-- Table Definition ----------------------------------------------

CREATE TABLE article (
    id SERIAL PRIMARY KEY,
    title text,
    category integer,
    body text,
    mobile_body text,
    published integer,
    is_headline integer,
    priority integer,
    preview text,
    avatar_url text,
    created_at timestamp without time zone,
    created_by text,
    modified_at timestamp without time zone,
    modified_by text,
    published_at timestamp without time zone,
    published_by text,
    text text,
    avatar_name text
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX article_pkey ON article(id int4_ops);

-- DDL generated by Postico 2.0.5
-- Not all database features are supported. Do not use for backup.

-- Table Definition ----------------------------------------------

CREATE TABLE attachment (
    id SERIAL PRIMARY KEY,
    name text,
    type text,
    path text,
    uploaded_at timestamp without time zone
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX attachment_pkey ON attachment(id int4_ops);


-- DDL generated by Postico 2.0.5
-- Not all database features are supported. Do not use for backup.

-- Table Definition ----------------------------------------------

CREATE TABLE tag (
    id SERIAL PRIMARY KEY,
    name text,
    article_id integer
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX tag_pkey ON tag(id int4_ops);

