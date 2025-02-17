--
-- PostgreSQL database cluster dump
--

-- Started on 2024-03-28 19:10:01

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE emas;
ALTER ROLE emas WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE giggo;
ALTER ROLE giggo WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'md5ce465d5dd5f22e5055d384e7889d38b2';
CREATE ROLE miguel;
ALTER ROLE miguel WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE node;
ALTER ROLE node WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'md5161674675d75da96ecc19027ca198061';
CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;

--
-- User Configurations
--






--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 13.14 (Debian 13.14-0+deb11u1)
-- Dumped by pg_dump version 16.2

-- Started on 2024-03-28 19:10:02

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 2982 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2024-03-28 19:10:08

--
-- PostgreSQL database dump complete
--

--
-- Database "giggo" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 13.14 (Debian 13.14-0+deb11u1)
-- Dumped by pg_dump version 16.2

-- Started on 2024-03-28 19:10:09

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3385 (class 1262 OID 16388)
-- Name: giggo; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE giggo WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';


ALTER DATABASE giggo OWNER TO postgres;

\connect giggo

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 205 (class 1259 OID 16483)
-- Name: alarm; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.alarm (
    alarm_id integer NOT NULL,
    device character varying(25) NOT NULL,
    date timestamp with time zone,
    alarm character varying(150)
);


ALTER TABLE public.alarm OWNER TO giggo;

--
-- TOC entry 204 (class 1259 OID 16481)
-- Name: alarm_alarm_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.alarm_alarm_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alarm_alarm_id_seq OWNER TO giggo;

--
-- TOC entry 3388 (class 0 OID 0)
-- Dependencies: 204
-- Name: alarm_alarm_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.alarm_alarm_id_seq OWNED BY public.alarm.alarm_id;


--
-- TOC entry 215 (class 1259 OID 16547)
-- Name: battery; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.battery (
    battery_id integer NOT NULL,
    device character varying(25) NOT NULL,
    date timestamp with time zone,
    battery numeric(5,2)
);


ALTER TABLE public.battery OWNER TO giggo;

--
-- TOC entry 214 (class 1259 OID 16545)
-- Name: battery_battery_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.battery_battery_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.battery_battery_id_seq OWNER TO giggo;

--
-- TOC entry 3391 (class 0 OID 0)
-- Dependencies: 214
-- Name: battery_battery_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.battery_battery_id_seq OWNED BY public.battery.battery_id;


--
-- TOC entry 223 (class 1259 OID 17239)
-- Name: clients; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.clients (
    clients_id integer NOT NULL,
    ramal integer NOT NULL,
    local integer NOT NULL,
    client integer NOT NULL,
    building integer NOT NULL,
    zone integer,
    area integer,
    sequence integer,
    sensitivity character varying(50),
    situation character varying(200),
    date_sit timestamp with time zone,
    name character varying(200),
    phone bigint
);


ALTER TABLE public.clients OWNER TO giggo;

--
-- TOC entry 222 (class 1259 OID 17237)
-- Name: clients_clients_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.clients_clients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clients_clients_id_seq OWNER TO giggo;

--
-- TOC entry 3394 (class 0 OID 0)
-- Dependencies: 222
-- Name: clients_clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.clients_clients_id_seq OWNED BY public.clients.clients_id;


--
-- TOC entry 221 (class 1259 OID 16699)
-- Name: coord; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.coord (
    coord_id integer NOT NULL,
    ramal integer NOT NULL,
    local integer NOT NULL,
    lat numeric(12,9),
    lon numeric(12,9)
);


ALTER TABLE public.coord OWNER TO giggo;

--
-- TOC entry 220 (class 1259 OID 16697)
-- Name: coord_coord_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.coord_coord_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coord_coord_id_seq OWNER TO giggo;

--
-- TOC entry 3397 (class 0 OID 0)
-- Dependencies: 220
-- Name: coord_coord_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.coord_coord_id_seq OWNED BY public.coord.coord_id;


--
-- TOC entry 217 (class 1259 OID 16556)
-- Name: dadosfaturacao; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.dadosfaturacao (
    dadosfaturacao_id integer NOT NULL,
    ramal integer NOT NULL,
    local integer NOT NULL,
    date timestamp with time zone,
    volume numeric(6,2),
    volume_fat numeric(6,2),
    date_ini timestamp with time zone,
    date_fim timestamp with time zone
);


ALTER TABLE public.dadosfaturacao OWNER TO giggo;

--
-- TOC entry 216 (class 1259 OID 16554)
-- Name: dadosfaturacao_dadosfaturacao_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.dadosfaturacao_dadosfaturacao_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dadosfaturacao_dadosfaturacao_id_seq OWNER TO giggo;

--
-- TOC entry 3400 (class 0 OID 0)
-- Dependencies: 216
-- Name: dadosfaturacao_dadosfaturacao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.dadosfaturacao_dadosfaturacao_id_seq OWNED BY public.dadosfaturacao.dadosfaturacao_id;


--
-- TOC entry 201 (class 1259 OID 16463)
-- Name: flow; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.flow (
    flow_id bigint NOT NULL,
    device character varying(25) NOT NULL,
    date timestamp with time zone,
    flow numeric(8,3)
);


ALTER TABLE public.flow OWNER TO giggo;

--
-- TOC entry 200 (class 1259 OID 16461)
-- Name: flow_flow_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.flow_flow_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.flow_flow_id_seq OWNER TO giggo;

--
-- TOC entry 3403 (class 0 OID 0)
-- Dependencies: 200
-- Name: flow_flow_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.flow_flow_id_seq OWNED BY public.flow.flow_id;


--
-- TOC entry 211 (class 1259 OID 16530)
-- Name: flow_inv; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.flow_inv (
    flow_inv_id integer NOT NULL,
    device character varying(25) NOT NULL,
    date timestamp with time zone,
    flow numeric(8,3)
);


ALTER TABLE public.flow_inv OWNER TO giggo;

--
-- TOC entry 210 (class 1259 OID 16528)
-- Name: flow_inv_flow_inv_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.flow_inv_flow_inv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.flow_inv_flow_inv_id_seq OWNER TO giggo;

--
-- TOC entry 3406 (class 0 OID 0)
-- Dependencies: 210
-- Name: flow_inv_flow_inv_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.flow_inv_flow_inv_id_seq OWNED BY public.flow_inv.flow_inv_id;


--
-- TOC entry 261 (class 1259 OID 18996)
-- Name: georequest; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.georequest (
    georequest_id integer NOT NULL,
    date timestamp with time zone,
    request character varying(25),
    symptom character varying(200),
    state character varying(30),
    street character varying(200),
    locality character varying(200),
    zmc character varying(200),
    lat numeric(20,16),
    lon numeric(20,16)
);


ALTER TABLE public.georequest OWNER TO giggo;

--
-- TOC entry 260 (class 1259 OID 18994)
-- Name: georequest_georequest_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.georequest_georequest_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.georequest_georequest_id_seq OWNER TO giggo;

--
-- TOC entry 3409 (class 0 OID 0)
-- Dependencies: 260
-- Name: georequest_georequest_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.georequest_georequest_id_seq OWNED BY public.georequest.georequest_id;


--
-- TOC entry 267 (class 1259 OID 19400)
-- Name: gis_data; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.gis_data (
    gis_data_id integer NOT NULL,
    zmc character varying(200),
    tubagens_l numeric(8,3),
    ramais_n numeric(8,3),
    ramais_l numeric(8,3),
    ramais_lmed numeric(8,3)
);


ALTER TABLE public.gis_data OWNER TO giggo;

--
-- TOC entry 266 (class 1259 OID 19398)
-- Name: gis_data_gis_data_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.gis_data_gis_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.gis_data_gis_data_id_seq OWNER TO giggo;

--
-- TOC entry 3412 (class 0 OID 0)
-- Dependencies: 266
-- Name: gis_data_gis_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.gis_data_gis_data_id_seq OWNED BY public.gis_data.gis_data_id;


--
-- TOC entry 219 (class 1259 OID 16566)
-- Name: infocontrato; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.infocontrato (
    infocontrato_id integer NOT NULL,
    ramal integer NOT NULL,
    local integer NOT NULL,
    client integer NOT NULL,
    device character varying(50),
    name character varying(200),
    street character varying(250),
    num_pol character varying(100),
    floor character varying(100),
    locality character varying(200),
    situation character varying(200),
    client_group character varying(200),
    client_tariff character varying(200),
    date_inst timestamp with time zone,
    brand character varying(100),
    year integer,
    dn integer,
    estimated integer,
    zone integer,
    area integer,
    sequence integer
);


ALTER TABLE public.infocontrato OWNER TO giggo;

--
-- TOC entry 218 (class 1259 OID 16564)
-- Name: infocontrato_infocontrato_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.infocontrato_infocontrato_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.infocontrato_infocontrato_id_seq OWNER TO giggo;

--
-- TOC entry 3415 (class 0 OID 0)
-- Dependencies: 218
-- Name: infocontrato_infocontrato_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.infocontrato_infocontrato_id_seq OWNED BY public.infocontrato.infocontrato_id;


--
-- TOC entry 249 (class 1259 OID 18648)
-- Name: infometers; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.infometers (
    infometers_id integer NOT NULL,
    tag_id character varying(200),
    age numeric(6,2),
    meters integer,
    bad integer,
    tocheck integer
);


ALTER TABLE public.infometers OWNER TO giggo;

--
-- TOC entry 248 (class 1259 OID 18646)
-- Name: infometers_infometers_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.infometers_infometers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.infometers_infometers_id_seq OWNER TO giggo;

--
-- TOC entry 3418 (class 0 OID 0)
-- Dependencies: 248
-- Name: infometers_infometers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.infometers_infometers_id_seq OWNED BY public.infometers.infometers_id;


--
-- TOC entry 251 (class 1259 OID 18658)
-- Name: infometerszmc; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.infometerszmc (
    infometerszmc_id integer NOT NULL,
    tag_id character varying(200),
    age numeric(6,2),
    meters integer,
    bad integer,
    tocheck integer
);


ALTER TABLE public.infometerszmc OWNER TO giggo;

--
-- TOC entry 250 (class 1259 OID 18656)
-- Name: infometerszmc_infometerszmc_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.infometerszmc_infometerszmc_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.infometerszmc_infometerszmc_id_seq OWNER TO giggo;

--
-- TOC entry 3421 (class 0 OID 0)
-- Dependencies: 250
-- Name: infometerszmc_infometerszmc_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.infometerszmc_infometerszmc_id_seq OWNED BY public.infometerszmc.infometerszmc_id;


--
-- TOC entry 253 (class 1259 OID 18718)
-- Name: kpi; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.kpi (
    kpi_id integer NOT NULL,
    zmc character varying(200),
    tub_l numeric(8,2),
    ram_n integer,
    ram_lm numeric(6,2),
    cli integer,
    cli_dom integer,
    qmin numeric(8,3),
    pressure numeric(5,2),
    qmd numeric(7,2),
    qliq numeric(8,3)
);


ALTER TABLE public.kpi OWNER TO giggo;

--
-- TOC entry 252 (class 1259 OID 18716)
-- Name: kpi_kpi_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.kpi_kpi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.kpi_kpi_id_seq OWNER TO giggo;

--
-- TOC entry 3424 (class 0 OID 0)
-- Dependencies: 252
-- Name: kpi_kpi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.kpi_kpi_id_seq OWNED BY public.kpi.kpi_id;


--
-- TOC entry 259 (class 1259 OID 18966)
-- Name: ldds75; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.ldds75 (
    ldds75_id integer NOT NULL,
    device character varying(25) NOT NULL,
    date timestamp with time zone,
    battery numeric(6,3),
    distance numeric(5,3),
    lat numeric(12,9),
    lon numeric(12,9)
);


ALTER TABLE public.ldds75 OWNER TO giggo;

--
-- TOC entry 258 (class 1259 OID 18964)
-- Name: ldds75_ldds75_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.ldds75_ldds75_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ldds75_ldds75_id_seq OWNER TO giggo;

--
-- TOC entry 3427 (class 0 OID 0)
-- Dependencies: 258
-- Name: ldds75_ldds75_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.ldds75_ldds75_id_seq OWNED BY public.ldds75.ldds75_id;


--
-- TOC entry 225 (class 1259 OID 17410)
-- Name: meters; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.meters (
    meters_id integer NOT NULL,
    ramal integer,
    local integer,
    client integer,
    device character varying(25) NOT NULL,
    date_inst timestamp with time zone,
    dn integer,
    class character varying(200),
    brand character varying(100),
    model character varying(100),
    volume integer,
    date_leit timestamp with time zone,
    street character varying(250),
    num_pol character varying(100),
    floor character varying(100)
);


ALTER TABLE public.meters OWNER TO giggo;

--
-- TOC entry 224 (class 1259 OID 17408)
-- Name: meters_meters_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.meters_meters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.meters_meters_id_seq OWNER TO giggo;

--
-- TOC entry 3430 (class 0 OID 0)
-- Dependencies: 224
-- Name: meters_meters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.meters_meters_id_seq OWNED BY public.meters.meters_id;


--
-- TOC entry 271 (class 1259 OID 20716)
-- Name: nbiot_gps; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.nbiot_gps (
    nbiot_gps_id integer NOT NULL,
    device character varying(25) NOT NULL,
    street character varying(200),
    lat numeric(12,9),
    lon numeric(12,9)
);


ALTER TABLE public.nbiot_gps OWNER TO giggo;

--
-- TOC entry 270 (class 1259 OID 20714)
-- Name: nbiot_gps_nbiot_gps_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.nbiot_gps_nbiot_gps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nbiot_gps_nbiot_gps_id_seq OWNER TO giggo;

--
-- TOC entry 3433 (class 0 OID 0)
-- Dependencies: 270
-- Name: nbiot_gps_nbiot_gps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.nbiot_gps_nbiot_gps_id_seq OWNED BY public.nbiot_gps.nbiot_gps_id;


--
-- TOC entry 207 (class 1259 OID 16514)
-- Name: nkeaux; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.nkeaux (
    nkeaux_id integer NOT NULL,
    device character varying(25) NOT NULL,
    date timestamp with time zone,
    flow numeric(8,3)
);


ALTER TABLE public.nkeaux OWNER TO giggo;

--
-- TOC entry 206 (class 1259 OID 16512)
-- Name: nkeaux_nkeaux_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.nkeaux_nkeaux_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nkeaux_nkeaux_id_seq OWNER TO giggo;

--
-- TOC entry 3436 (class 0 OID 0)
-- Dependencies: 206
-- Name: nkeaux_nkeaux_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.nkeaux_nkeaux_id_seq OWNED BY public.nkeaux.nkeaux_id;


--
-- TOC entry 209 (class 1259 OID 16522)
-- Name: nkeauxinv; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.nkeauxinv (
    nkeauxinv_id integer NOT NULL,
    device character varying(25) NOT NULL,
    date timestamp with time zone,
    flow numeric(8,3)
);


ALTER TABLE public.nkeauxinv OWNER TO giggo;

--
-- TOC entry 208 (class 1259 OID 16520)
-- Name: nkeauxinv_nkeauxinv_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.nkeauxinv_nkeauxinv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nkeauxinv_nkeauxinv_id_seq OWNER TO giggo;

--
-- TOC entry 3439 (class 0 OID 0)
-- Dependencies: 208
-- Name: nkeauxinv_nkeauxinv_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.nkeauxinv_nkeauxinv_id_seq OWNED BY public.nkeauxinv.nkeauxinv_id;


--
-- TOC entry 229 (class 1259 OID 17874)
-- Name: pressure; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.pressure (
    pressure_id integer NOT NULL,
    device character varying(25) NOT NULL,
    date timestamp with time zone,
    pressure numeric(5,2),
    battery numeric(5,3),
    lat numeric(12,9),
    lon numeric(12,9)
);


ALTER TABLE public.pressure OWNER TO giggo;

--
-- TOC entry 228 (class 1259 OID 17872)
-- Name: pressure_pressure_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.pressure_pressure_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pressure_pressure_id_seq OWNER TO giggo;

--
-- TOC entry 3442 (class 0 OID 0)
-- Dependencies: 228
-- Name: pressure_pressure_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.pressure_pressure_id_seq OWNED BY public.pressure.pressure_id;


--
-- TOC entry 235 (class 1259 OID 18166)
-- Name: qmin; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.qmin (
    qmin_id integer NOT NULL,
    tag_id integer NOT NULL,
    date timestamp with time zone,
    flow numeric(8,3)
);


ALTER TABLE public.qmin OWNER TO giggo;

--
-- TOC entry 245 (class 1259 OID 18359)
-- Name: qmin48; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.qmin48 (
    qmin48_id integer NOT NULL,
    tag_id integer NOT NULL,
    date timestamp with time zone,
    flow numeric(8,3)
);


ALTER TABLE public.qmin48 OWNER TO giggo;

--
-- TOC entry 244 (class 1259 OID 18357)
-- Name: qmin48_qmin48_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.qmin48_qmin48_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.qmin48_qmin48_id_seq OWNER TO giggo;

--
-- TOC entry 3446 (class 0 OID 0)
-- Dependencies: 244
-- Name: qmin48_qmin48_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.qmin48_qmin48_id_seq OWNED BY public.qmin48.qmin48_id;


--
-- TOC entry 265 (class 1259 OID 19378)
-- Name: qmin4ev; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.qmin4ev (
    qmin4ev_id integer NOT NULL,
    tag_id integer NOT NULL,
    date timestamp with time zone,
    flow numeric(8,3)
);


ALTER TABLE public.qmin4ev OWNER TO giggo;

--
-- TOC entry 264 (class 1259 OID 19376)
-- Name: qmin4ev_qmin4ev_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.qmin4ev_qmin4ev_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.qmin4ev_qmin4ev_id_seq OWNER TO giggo;

--
-- TOC entry 3449 (class 0 OID 0)
-- Dependencies: 264
-- Name: qmin4ev_qmin4ev_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.qmin4ev_qmin4ev_id_seq OWNED BY public.qmin4ev.qmin4ev_id;


--
-- TOC entry 234 (class 1259 OID 18164)
-- Name: qmin_qmin_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.qmin_qmin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.qmin_qmin_id_seq OWNER TO giggo;

--
-- TOC entry 3451 (class 0 OID 0)
-- Dependencies: 234
-- Name: qmin_qmin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.qmin_qmin_id_seq OWNED BY public.qmin.qmin_id;


--
-- TOC entry 233 (class 1259 OID 18059)
-- Name: ramaislocais; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.ramaislocais (
    ramaislocais_id integer NOT NULL,
    ramal integer NOT NULL,
    local integer NOT NULL,
    client integer,
    zone integer,
    area integer,
    sequence integer,
    situation character varying(200),
    date_leit timestamp with time zone,
    street character varying(250),
    num_pol character varying(100),
    floor character varying(100)
);


ALTER TABLE public.ramaislocais OWNER TO giggo;

--
-- TOC entry 232 (class 1259 OID 18057)
-- Name: ramaislocais_ramaislocais_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.ramaislocais_ramaislocais_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ramaislocais_ramaislocais_id_seq OWNER TO giggo;

--
-- TOC entry 3454 (class 0 OID 0)
-- Dependencies: 232
-- Name: ramaislocais_ramaislocais_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.ramaislocais_ramaislocais_id_seq OWNED BY public.ramaislocais.ramaislocais_id;


--
-- TOC entry 227 (class 1259 OID 17498)
-- Name: ramaisrua; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.ramaisrua (
    ramaisrua_id integer NOT NULL,
    ramal integer NOT NULL,
    predio integer NOT NULL,
    zmc character varying(200),
    dt_sit timestamp with time zone
);


ALTER TABLE public.ramaisrua OWNER TO giggo;

--
-- TOC entry 226 (class 1259 OID 17496)
-- Name: ramaisrua_ramaisrua_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.ramaisrua_ramaisrua_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ramaisrua_ramaisrua_id_seq OWNER TO giggo;

--
-- TOC entry 3457 (class 0 OID 0)
-- Dependencies: 226
-- Name: ramaisrua_ramaisrua_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.ramaisrua_ramaisrua_id_seq OWNED BY public.ramaisrua.ramaisrua_id;


--
-- TOC entry 263 (class 1259 OID 19082)
-- Name: reqso; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.reqso (
    reqso_id integer NOT NULL,
    date timestamp with time zone,
    zmc character varying(200),
    requests integer,
    orders integer
);


ALTER TABLE public.reqso OWNER TO giggo;

--
-- TOC entry 262 (class 1259 OID 19080)
-- Name: reqso_reqso_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.reqso_reqso_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reqso_reqso_id_seq OWNER TO giggo;

--
-- TOC entry 3460 (class 0 OID 0)
-- Dependencies: 262
-- Name: reqso_reqso_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.reqso_reqso_id_seq OWNED BY public.reqso.reqso_id;


--
-- TOC entry 231 (class 1259 OID 17888)
-- Name: transmission; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.transmission (
    transmission_id integer NOT NULL,
    gateway character varying(25) NOT NULL,
    device character varying(25) NOT NULL,
    date timestamp with time zone,
    rssi integer NOT NULL,
    snr numeric(5,2) NOT NULL,
    sf integer NOT NULL
);


ALTER TABLE public.transmission OWNER TO giggo;

--
-- TOC entry 230 (class 1259 OID 17886)
-- Name: transmission_transmission_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.transmission_transmission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transmission_transmission_id_seq OWNER TO giggo;

--
-- TOC entry 3463 (class 0 OID 0)
-- Dependencies: 230
-- Name: transmission_transmission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.transmission_transmission_id_seq OWNED BY public.transmission.transmission_id;


--
-- TOC entry 203 (class 1259 OID 16474)
-- Name: volume; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.volume (
    volume_id integer NOT NULL,
    device character varying(25) NOT NULL,
    date timestamp with time zone,
    volume numeric(9,2)
);


ALTER TABLE public.volume OWNER TO giggo;

--
-- TOC entry 213 (class 1259 OID 16538)
-- Name: volume_inv; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.volume_inv (
    volume_inv_id integer NOT NULL,
    device character varying(25) NOT NULL,
    date timestamp with time zone,
    volume numeric(9,2)
);


ALTER TABLE public.volume_inv OWNER TO giggo;

--
-- TOC entry 212 (class 1259 OID 16536)
-- Name: volume_inv_volume_inv_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.volume_inv_volume_inv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.volume_inv_volume_inv_id_seq OWNER TO giggo;

--
-- TOC entry 3467 (class 0 OID 0)
-- Dependencies: 212
-- Name: volume_inv_volume_inv_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.volume_inv_volume_inv_id_seq OWNED BY public.volume_inv.volume_inv_id;


--
-- TOC entry 202 (class 1259 OID 16472)
-- Name: volume_volume_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.volume_volume_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.volume_volume_id_seq OWNER TO giggo;

--
-- TOC entry 3469 (class 0 OID 0)
-- Dependencies: 202
-- Name: volume_volume_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.volume_volume_id_seq OWNED BY public.volume.volume_id;


--
-- TOC entry 269 (class 1259 OID 20559)
-- Name: water_leak; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.water_leak (
    water_leak_id integer NOT NULL,
    device character varying(25) NOT NULL,
    model character varying(25),
    version integer,
    date timestamp with time zone,
    battery numeric(5,3),
    signal integer,
    alarm boolean,
    count_mod boolean,
    tdc_flag boolean,
    leak_status boolean,
    leak_times integer,
    leak_duration integer
);


ALTER TABLE public.water_leak OWNER TO giggo;

--
-- TOC entry 268 (class 1259 OID 20557)
-- Name: water_leak_water_leak_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.water_leak_water_leak_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.water_leak_water_leak_id_seq OWNER TO giggo;

--
-- TOC entry 3472 (class 0 OID 0)
-- Dependencies: 268
-- Name: water_leak_water_leak_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.water_leak_water_leak_id_seq OWNED BY public.water_leak.water_leak_id;


--
-- TOC entry 257 (class 1259 OID 18917)
-- Name: weather; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.weather (
    weather_id integer NOT NULL,
    device character varying(25) NOT NULL,
    date timestamp with time zone,
    air_temperature numeric(6,2),
    air_humidity numeric(6,2),
    light_intensity numeric(8,2),
    uv_index numeric(6,2),
    wind_speed numeric(6,2),
    wind_direction numeric(6,2),
    rain_gauge numeric(6,3),
    barometric_pressure numeric(8,2)
);


ALTER TABLE public.weather OWNER TO giggo;

--
-- TOC entry 256 (class 1259 OID 18915)
-- Name: weather_weather_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.weather_weather_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.weather_weather_id_seq OWNER TO giggo;

--
-- TOC entry 3475 (class 0 OID 0)
-- Dependencies: 256
-- Name: weather_weather_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.weather_weather_id_seq OWNED BY public.weather.weather_id;


--
-- TOC entry 243 (class 1259 OID 18350)
-- Name: zmccontratos; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.zmccontratos (
    zmccontratos_id integer NOT NULL,
    tag_id character varying(200),
    contratos integer
);


ALTER TABLE public.zmccontratos OWNER TO giggo;

--
-- TOC entry 242 (class 1259 OID 18348)
-- Name: zmccontratos_zmccontratos_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.zmccontratos_zmccontratos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.zmccontratos_zmccontratos_id_seq OWNER TO giggo;

--
-- TOC entry 3478 (class 0 OID 0)
-- Dependencies: 242
-- Name: zmccontratos_zmccontratos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.zmccontratos_zmccontratos_id_seq OWNED BY public.zmccontratos.zmccontratos_id;


--
-- TOC entry 247 (class 1259 OID 18428)
-- Name: zmcflowdis; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.zmcflowdis (
    zmcflowdis_id bigint NOT NULL,
    tag_id integer NOT NULL,
    date timestamp with time zone,
    flow numeric(8,3)
);


ALTER TABLE public.zmcflowdis OWNER TO giggo;

--
-- TOC entry 246 (class 1259 OID 18426)
-- Name: zmcflowdis_zmcflowdis_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.zmcflowdis_zmcflowdis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.zmcflowdis_zmcflowdis_id_seq OWNER TO giggo;

--
-- TOC entry 3481 (class 0 OID 0)
-- Dependencies: 246
-- Name: zmcflowdis_zmcflowdis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.zmcflowdis_zmcflowdis_id_seq OWNED BY public.zmcflowdis.zmcflowdis_id;


--
-- TOC entry 255 (class 1259 OID 18761)
-- Name: zmcqliq; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.zmcqliq (
    zmcqliq_id integer NOT NULL,
    zmc character varying(200),
    date timestamp with time zone,
    dis numeric(8,3),
    tel numeric(8,3),
    liq numeric(8,3)
);


ALTER TABLE public.zmcqliq OWNER TO giggo;

--
-- TOC entry 254 (class 1259 OID 18759)
-- Name: zmcqliq_zmcqliq_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.zmcqliq_zmcqliq_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.zmcqliq_zmcqliq_id_seq OWNER TO giggo;

--
-- TOC entry 3484 (class 0 OID 0)
-- Dependencies: 254
-- Name: zmcqliq_zmcqliq_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.zmcqliq_zmcqliq_id_seq OWNED BY public.zmcqliq.zmcqliq_id;


--
-- TOC entry 237 (class 1259 OID 18177)
-- Name: zmctag; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.zmctag (
    zmctag_id integer NOT NULL,
    tag_id integer NOT NULL,
    zmc character varying(200),
    vol_id integer NOT NULL,
    volfat_id character varying(200),
    tbr integer,
    rph integer,
    sig_id character varying(200),
    dad character varying(200)
);


ALTER TABLE public.zmctag OWNER TO giggo;

--
-- TOC entry 236 (class 1259 OID 18175)
-- Name: zmctag_zmctag_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.zmctag_zmctag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.zmctag_zmctag_id_seq OWNER TO giggo;

--
-- TOC entry 3487 (class 0 OID 0)
-- Dependencies: 236
-- Name: zmctag_zmctag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.zmctag_zmctag_id_seq OWNED BY public.zmctag.zmctag_id;


--
-- TOC entry 239 (class 1259 OID 18194)
-- Name: zmcvol; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.zmcvol (
    zmcvol_id integer NOT NULL,
    tag_id integer NOT NULL,
    date timestamp with time zone,
    volume numeric(9,2)
);


ALTER TABLE public.zmcvol OWNER TO giggo;

--
-- TOC entry 238 (class 1259 OID 18192)
-- Name: zmcvol_zmcvol_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.zmcvol_zmcvol_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.zmcvol_zmcvol_id_seq OWNER TO giggo;

--
-- TOC entry 3490 (class 0 OID 0)
-- Dependencies: 238
-- Name: zmcvol_zmcvol_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.zmcvol_zmcvol_id_seq OWNED BY public.zmcvol.zmcvol_id;


--
-- TOC entry 241 (class 1259 OID 18214)
-- Name: zmcvolfat; Type: TABLE; Schema: public; Owner: giggo
--

CREATE TABLE public.zmcvolfat (
    zmcvolfat_id integer NOT NULL,
    tag_id character varying(200),
    date timestamp with time zone,
    volume numeric(9,2)
);


ALTER TABLE public.zmcvolfat OWNER TO giggo;

--
-- TOC entry 240 (class 1259 OID 18212)
-- Name: zmcvolfat_zmcvolfat_id_seq; Type: SEQUENCE; Schema: public; Owner: giggo
--

CREATE SEQUENCE public.zmcvolfat_zmcvolfat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.zmcvolfat_zmcvolfat_id_seq OWNER TO giggo;

--
-- TOC entry 3493 (class 0 OID 0)
-- Dependencies: 240
-- Name: zmcvolfat_zmcvolfat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: giggo
--

ALTER SEQUENCE public.zmcvolfat_zmcvolfat_id_seq OWNED BY public.zmcvolfat.zmcvolfat_id;


--
-- TOC entry 3070 (class 2604 OID 16486)
-- Name: alarm alarm_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.alarm ALTER COLUMN alarm_id SET DEFAULT nextval('public.alarm_alarm_id_seq'::regclass);


--
-- TOC entry 3075 (class 2604 OID 16550)
-- Name: battery battery_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.battery ALTER COLUMN battery_id SET DEFAULT nextval('public.battery_battery_id_seq'::regclass);


--
-- TOC entry 3079 (class 2604 OID 17242)
-- Name: clients clients_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.clients ALTER COLUMN clients_id SET DEFAULT nextval('public.clients_clients_id_seq'::regclass);


--
-- TOC entry 3078 (class 2604 OID 16702)
-- Name: coord coord_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.coord ALTER COLUMN coord_id SET DEFAULT nextval('public.coord_coord_id_seq'::regclass);


--
-- TOC entry 3076 (class 2604 OID 16559)
-- Name: dadosfaturacao dadosfaturacao_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.dadosfaturacao ALTER COLUMN dadosfaturacao_id SET DEFAULT nextval('public.dadosfaturacao_dadosfaturacao_id_seq'::regclass);


--
-- TOC entry 3068 (class 2604 OID 20655)
-- Name: flow flow_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.flow ALTER COLUMN flow_id SET DEFAULT nextval('public.flow_flow_id_seq'::regclass);


--
-- TOC entry 3073 (class 2604 OID 16533)
-- Name: flow_inv flow_inv_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.flow_inv ALTER COLUMN flow_inv_id SET DEFAULT nextval('public.flow_inv_flow_inv_id_seq'::regclass);


--
-- TOC entry 3098 (class 2604 OID 18999)
-- Name: georequest georequest_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.georequest ALTER COLUMN georequest_id SET DEFAULT nextval('public.georequest_georequest_id_seq'::regclass);


--
-- TOC entry 3101 (class 2604 OID 19403)
-- Name: gis_data gis_data_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.gis_data ALTER COLUMN gis_data_id SET DEFAULT nextval('public.gis_data_gis_data_id_seq'::regclass);


--
-- TOC entry 3077 (class 2604 OID 16569)
-- Name: infocontrato infocontrato_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.infocontrato ALTER COLUMN infocontrato_id SET DEFAULT nextval('public.infocontrato_infocontrato_id_seq'::regclass);


--
-- TOC entry 3092 (class 2604 OID 18651)
-- Name: infometers infometers_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.infometers ALTER COLUMN infometers_id SET DEFAULT nextval('public.infometers_infometers_id_seq'::regclass);


--
-- TOC entry 3093 (class 2604 OID 18661)
-- Name: infometerszmc infometerszmc_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.infometerszmc ALTER COLUMN infometerszmc_id SET DEFAULT nextval('public.infometerszmc_infometerszmc_id_seq'::regclass);


--
-- TOC entry 3094 (class 2604 OID 18721)
-- Name: kpi kpi_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.kpi ALTER COLUMN kpi_id SET DEFAULT nextval('public.kpi_kpi_id_seq'::regclass);


--
-- TOC entry 3097 (class 2604 OID 18969)
-- Name: ldds75 ldds75_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.ldds75 ALTER COLUMN ldds75_id SET DEFAULT nextval('public.ldds75_ldds75_id_seq'::regclass);


--
-- TOC entry 3080 (class 2604 OID 17413)
-- Name: meters meters_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.meters ALTER COLUMN meters_id SET DEFAULT nextval('public.meters_meters_id_seq'::regclass);


--
-- TOC entry 3103 (class 2604 OID 20719)
-- Name: nbiot_gps nbiot_gps_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.nbiot_gps ALTER COLUMN nbiot_gps_id SET DEFAULT nextval('public.nbiot_gps_nbiot_gps_id_seq'::regclass);


--
-- TOC entry 3071 (class 2604 OID 16517)
-- Name: nkeaux nkeaux_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.nkeaux ALTER COLUMN nkeaux_id SET DEFAULT nextval('public.nkeaux_nkeaux_id_seq'::regclass);


--
-- TOC entry 3072 (class 2604 OID 16525)
-- Name: nkeauxinv nkeauxinv_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.nkeauxinv ALTER COLUMN nkeauxinv_id SET DEFAULT nextval('public.nkeauxinv_nkeauxinv_id_seq'::regclass);


--
-- TOC entry 3082 (class 2604 OID 17877)
-- Name: pressure pressure_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.pressure ALTER COLUMN pressure_id SET DEFAULT nextval('public.pressure_pressure_id_seq'::regclass);


--
-- TOC entry 3085 (class 2604 OID 18169)
-- Name: qmin qmin_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.qmin ALTER COLUMN qmin_id SET DEFAULT nextval('public.qmin_qmin_id_seq'::regclass);


--
-- TOC entry 3090 (class 2604 OID 18362)
-- Name: qmin48 qmin48_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.qmin48 ALTER COLUMN qmin48_id SET DEFAULT nextval('public.qmin48_qmin48_id_seq'::regclass);


--
-- TOC entry 3100 (class 2604 OID 19381)
-- Name: qmin4ev qmin4ev_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.qmin4ev ALTER COLUMN qmin4ev_id SET DEFAULT nextval('public.qmin4ev_qmin4ev_id_seq'::regclass);


--
-- TOC entry 3084 (class 2604 OID 18062)
-- Name: ramaislocais ramaislocais_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.ramaislocais ALTER COLUMN ramaislocais_id SET DEFAULT nextval('public.ramaislocais_ramaislocais_id_seq'::regclass);


--
-- TOC entry 3081 (class 2604 OID 17501)
-- Name: ramaisrua ramaisrua_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.ramaisrua ALTER COLUMN ramaisrua_id SET DEFAULT nextval('public.ramaisrua_ramaisrua_id_seq'::regclass);


--
-- TOC entry 3099 (class 2604 OID 19085)
-- Name: reqso reqso_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.reqso ALTER COLUMN reqso_id SET DEFAULT nextval('public.reqso_reqso_id_seq'::regclass);


--
-- TOC entry 3083 (class 2604 OID 17891)
-- Name: transmission transmission_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.transmission ALTER COLUMN transmission_id SET DEFAULT nextval('public.transmission_transmission_id_seq'::regclass);


--
-- TOC entry 3069 (class 2604 OID 16477)
-- Name: volume volume_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.volume ALTER COLUMN volume_id SET DEFAULT nextval('public.volume_volume_id_seq'::regclass);


--
-- TOC entry 3074 (class 2604 OID 16541)
-- Name: volume_inv volume_inv_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.volume_inv ALTER COLUMN volume_inv_id SET DEFAULT nextval('public.volume_inv_volume_inv_id_seq'::regclass);


--
-- TOC entry 3102 (class 2604 OID 20562)
-- Name: water_leak water_leak_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.water_leak ALTER COLUMN water_leak_id SET DEFAULT nextval('public.water_leak_water_leak_id_seq'::regclass);


--
-- TOC entry 3096 (class 2604 OID 18920)
-- Name: weather weather_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.weather ALTER COLUMN weather_id SET DEFAULT nextval('public.weather_weather_id_seq'::regclass);


--
-- TOC entry 3089 (class 2604 OID 18353)
-- Name: zmccontratos zmccontratos_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.zmccontratos ALTER COLUMN zmccontratos_id SET DEFAULT nextval('public.zmccontratos_zmccontratos_id_seq'::regclass);


--
-- TOC entry 3091 (class 2604 OID 20645)
-- Name: zmcflowdis zmcflowdis_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.zmcflowdis ALTER COLUMN zmcflowdis_id SET DEFAULT nextval('public.zmcflowdis_zmcflowdis_id_seq'::regclass);


--
-- TOC entry 3095 (class 2604 OID 18764)
-- Name: zmcqliq zmcqliq_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.zmcqliq ALTER COLUMN zmcqliq_id SET DEFAULT nextval('public.zmcqliq_zmcqliq_id_seq'::regclass);


--
-- TOC entry 3086 (class 2604 OID 18180)
-- Name: zmctag zmctag_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.zmctag ALTER COLUMN zmctag_id SET DEFAULT nextval('public.zmctag_zmctag_id_seq'::regclass);


--
-- TOC entry 3087 (class 2604 OID 18197)
-- Name: zmcvol zmcvol_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.zmcvol ALTER COLUMN zmcvol_id SET DEFAULT nextval('public.zmcvol_zmcvol_id_seq'::regclass);


--
-- TOC entry 3088 (class 2604 OID 18217)
-- Name: zmcvolfat zmcvolfat_id; Type: DEFAULT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.zmcvolfat ALTER COLUMN zmcvolfat_id SET DEFAULT nextval('public.zmcvolfat_zmcvolfat_id_seq'::regclass);


--
-- TOC entry 3116 (class 2606 OID 16488)
-- Name: alarm alarm_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.alarm
    ADD CONSTRAINT alarm_pkey PRIMARY KEY (alarm_id);


--
-- TOC entry 3128 (class 2606 OID 16552)
-- Name: battery battery_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.battery
    ADD CONSTRAINT battery_pkey PRIMARY KEY (battery_id);


--
-- TOC entry 3146 (class 2606 OID 17246)
-- Name: clients clients_client_key; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_client_key UNIQUE (client);


--
-- TOC entry 3148 (class 2606 OID 17244)
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (clients_id);


--
-- TOC entry 3139 (class 2606 OID 16708)
-- Name: coord coord_local_key; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.coord
    ADD CONSTRAINT coord_local_key UNIQUE (local);


--
-- TOC entry 3141 (class 2606 OID 16704)
-- Name: coord coord_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.coord
    ADD CONSTRAINT coord_pkey PRIMARY KEY (coord_id);


--
-- TOC entry 3131 (class 2606 OID 16561)
-- Name: dadosfaturacao dadosfaturacao_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.dadosfaturacao
    ADD CONSTRAINT dadosfaturacao_pkey PRIMARY KEY (dadosfaturacao_id);


--
-- TOC entry 3107 (class 2606 OID 16491)
-- Name: flow flow_device_date_key; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.flow
    ADD CONSTRAINT flow_device_date_key UNIQUE (device, date);


--
-- TOC entry 3123 (class 2606 OID 16535)
-- Name: flow_inv flow_inv_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.flow_inv
    ADD CONSTRAINT flow_inv_pkey PRIMARY KEY (flow_inv_id);


--
-- TOC entry 3109 (class 2606 OID 20657)
-- Name: flow flow_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.flow
    ADD CONSTRAINT flow_pkey PRIMARY KEY (flow_id);


--
-- TOC entry 3230 (class 2606 OID 19004)
-- Name: georequest georequest_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.georequest
    ADD CONSTRAINT georequest_pkey PRIMARY KEY (georequest_id);


--
-- TOC entry 3240 (class 2606 OID 19405)
-- Name: gis_data gis_data_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.gis_data
    ADD CONSTRAINT gis_data_pkey PRIMARY KEY (gis_data_id);


--
-- TOC entry 3242 (class 2606 OID 19408)
-- Name: gis_data gis_data_zmc_key; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.gis_data
    ADD CONSTRAINT gis_data_zmc_key UNIQUE (zmc);


--
-- TOC entry 3135 (class 2606 OID 16576)
-- Name: infocontrato infocontrato_local_key; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.infocontrato
    ADD CONSTRAINT infocontrato_local_key UNIQUE (local);


--
-- TOC entry 3137 (class 2606 OID 16574)
-- Name: infocontrato infocontrato_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.infocontrato
    ADD CONSTRAINT infocontrato_pkey PRIMARY KEY (infocontrato_id);


--
-- TOC entry 3204 (class 2606 OID 18653)
-- Name: infometers infometers_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.infometers
    ADD CONSTRAINT infometers_pkey PRIMARY KEY (infometers_id);


--
-- TOC entry 3206 (class 2606 OID 18655)
-- Name: infometers infometers_tag_id_key; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.infometers
    ADD CONSTRAINT infometers_tag_id_key UNIQUE (tag_id);


--
-- TOC entry 3208 (class 2606 OID 18663)
-- Name: infometerszmc infometerszmc_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.infometerszmc
    ADD CONSTRAINT infometerszmc_pkey PRIMARY KEY (infometerszmc_id);


--
-- TOC entry 3210 (class 2606 OID 18665)
-- Name: infometerszmc infometerszmc_tag_id_key; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.infometerszmc
    ADD CONSTRAINT infometerszmc_tag_id_key UNIQUE (tag_id);


--
-- TOC entry 3212 (class 2606 OID 18723)
-- Name: kpi kpi_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.kpi
    ADD CONSTRAINT kpi_pkey PRIMARY KEY (kpi_id);


--
-- TOC entry 3214 (class 2606 OID 18725)
-- Name: kpi kpi_zmc_key; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.kpi
    ADD CONSTRAINT kpi_zmc_key UNIQUE (zmc);


--
-- TOC entry 3228 (class 2606 OID 18971)
-- Name: ldds75 ldds75_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.ldds75
    ADD CONSTRAINT ldds75_pkey PRIMARY KEY (ldds75_id);


--
-- TOC entry 3153 (class 2606 OID 17417)
-- Name: meters meters_device_key; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.meters
    ADD CONSTRAINT meters_device_key UNIQUE (device);


--
-- TOC entry 3155 (class 2606 OID 17415)
-- Name: meters meters_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.meters
    ADD CONSTRAINT meters_pkey PRIMARY KEY (meters_id);


--
-- TOC entry 3249 (class 2606 OID 20721)
-- Name: nbiot_gps nbiot_gps_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.nbiot_gps
    ADD CONSTRAINT nbiot_gps_pkey PRIMARY KEY (nbiot_gps_id);


--
-- TOC entry 3119 (class 2606 OID 16519)
-- Name: nkeaux nkeaux_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.nkeaux
    ADD CONSTRAINT nkeaux_pkey PRIMARY KEY (nkeaux_id);


--
-- TOC entry 3121 (class 2606 OID 16527)
-- Name: nkeauxinv nkeauxinv_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.nkeauxinv
    ADD CONSTRAINT nkeauxinv_pkey PRIMARY KEY (nkeauxinv_id);


--
-- TOC entry 3164 (class 2606 OID 17879)
-- Name: pressure pressure_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.pressure
    ADD CONSTRAINT pressure_pkey PRIMARY KEY (pressure_id);


--
-- TOC entry 3193 (class 2606 OID 18364)
-- Name: qmin48 qmin48_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.qmin48
    ADD CONSTRAINT qmin48_pkey PRIMARY KEY (qmin48_id);


--
-- TOC entry 3195 (class 2606 OID 18367)
-- Name: qmin48 qmin48_tag_id_key; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.qmin48
    ADD CONSTRAINT qmin48_tag_id_key UNIQUE (tag_id);


--
-- TOC entry 3237 (class 2606 OID 19383)
-- Name: qmin4ev qmin4ev_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.qmin4ev
    ADD CONSTRAINT qmin4ev_pkey PRIMARY KEY (qmin4ev_id);


--
-- TOC entry 3174 (class 2606 OID 18171)
-- Name: qmin qmin_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.qmin
    ADD CONSTRAINT qmin_pkey PRIMARY KEY (qmin_id);


--
-- TOC entry 3176 (class 2606 OID 18174)
-- Name: qmin qmin_tag_id_key; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.qmin
    ADD CONSTRAINT qmin_tag_id_key UNIQUE (tag_id);


--
-- TOC entry 3170 (class 2606 OID 18124)
-- Name: ramaislocais ramaislocais_local_key; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.ramaislocais
    ADD CONSTRAINT ramaislocais_local_key UNIQUE (local);


--
-- TOC entry 3172 (class 2606 OID 18067)
-- Name: ramaislocais ramaislocais_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.ramaislocais
    ADD CONSTRAINT ramaislocais_pkey PRIMARY KEY (ramaislocais_id);


--
-- TOC entry 3157 (class 2606 OID 17503)
-- Name: ramaisrua ramaisrua_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.ramaisrua
    ADD CONSTRAINT ramaisrua_pkey PRIMARY KEY (ramaisrua_id);


--
-- TOC entry 3159 (class 2606 OID 17508)
-- Name: ramaisrua ramaisrua_ramal_key; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.ramaisrua
    ADD CONSTRAINT ramaisrua_ramal_key UNIQUE (ramal);


--
-- TOC entry 3232 (class 2606 OID 19087)
-- Name: reqso reqso_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.reqso
    ADD CONSTRAINT reqso_pkey PRIMARY KEY (reqso_id);


--
-- TOC entry 3168 (class 2606 OID 17893)
-- Name: transmission transmission_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.transmission
    ADD CONSTRAINT transmission_pkey PRIMARY KEY (transmission_id);


--
-- TOC entry 3112 (class 2606 OID 19560)
-- Name: volume volume_device_date_key; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.volume
    ADD CONSTRAINT volume_device_date_key UNIQUE (device, date);


--
-- TOC entry 3126 (class 2606 OID 16543)
-- Name: volume_inv volume_inv_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.volume_inv
    ADD CONSTRAINT volume_inv_pkey PRIMARY KEY (volume_inv_id);


--
-- TOC entry 3114 (class 2606 OID 16479)
-- Name: volume volume_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.volume
    ADD CONSTRAINT volume_pkey PRIMARY KEY (volume_id);


--
-- TOC entry 3246 (class 2606 OID 20564)
-- Name: water_leak water_leak_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.water_leak
    ADD CONSTRAINT water_leak_pkey PRIMARY KEY (water_leak_id);


--
-- TOC entry 3224 (class 2606 OID 18922)
-- Name: weather weather_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.weather
    ADD CONSTRAINT weather_pkey PRIMARY KEY (weather_id);


--
-- TOC entry 3189 (class 2606 OID 18355)
-- Name: zmccontratos zmccontratos_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.zmccontratos
    ADD CONSTRAINT zmccontratos_pkey PRIMARY KEY (zmccontratos_id);


--
-- TOC entry 3191 (class 2606 OID 18645)
-- Name: zmccontratos zmccontratos_tag_id_key; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.zmccontratos
    ADD CONSTRAINT zmccontratos_tag_id_key UNIQUE (tag_id);


--
-- TOC entry 3198 (class 2606 OID 20647)
-- Name: zmcflowdis zmcflowdis_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.zmcflowdis
    ADD CONSTRAINT zmcflowdis_pkey PRIMARY KEY (zmcflowdis_id);


--
-- TOC entry 3200 (class 2606 OID 18776)
-- Name: zmcflowdis zmcflowdis_tag_id_date_key; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.zmcflowdis
    ADD CONSTRAINT zmcflowdis_tag_id_date_key UNIQUE (tag_id, date);


--
-- TOC entry 3216 (class 2606 OID 18766)
-- Name: zmcqliq zmcqliq_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.zmcqliq
    ADD CONSTRAINT zmcqliq_pkey PRIMARY KEY (zmcqliq_id);


--
-- TOC entry 3218 (class 2606 OID 18770)
-- Name: zmcqliq zmcqliq_zmc_date_key; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.zmcqliq
    ADD CONSTRAINT zmcqliq_zmc_date_key UNIQUE (zmc, date);


--
-- TOC entry 3180 (class 2606 OID 18182)
-- Name: zmctag zmctag_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.zmctag
    ADD CONSTRAINT zmctag_pkey PRIMARY KEY (zmctag_id);


--
-- TOC entry 3182 (class 2606 OID 18185)
-- Name: zmctag zmctag_tag_id_key; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.zmctag
    ADD CONSTRAINT zmctag_tag_id_key UNIQUE (tag_id);


--
-- TOC entry 3185 (class 2606 OID 18199)
-- Name: zmcvol zmcvol_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.zmcvol
    ADD CONSTRAINT zmcvol_pkey PRIMARY KEY (zmcvol_id);


--
-- TOC entry 3187 (class 2606 OID 18219)
-- Name: zmcvolfat zmcvolfat_pkey; Type: CONSTRAINT; Schema: public; Owner: giggo
--

ALTER TABLE ONLY public.zmcvolfat
    ADD CONSTRAINT zmcvolfat_pkey PRIMARY KEY (zmcvolfat_id);


--
-- TOC entry 3143 (class 1259 OID 17247)
-- Name: client_cli_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX client_cli_index ON public.clients USING btree (client);


--
-- TOC entry 3144 (class 1259 OID 18068)
-- Name: client_ramloc_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX client_ramloc_index ON public.clients USING btree (client);


--
-- TOC entry 3104 (class 1259 OID 16563)
-- Name: date_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX date_index ON public.flow USING btree (date);


--
-- TOC entry 3225 (class 1259 OID 18973)
-- Name: date_index_ldds; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX date_index_ldds ON public.ldds75 USING btree (date);


--
-- TOC entry 3221 (class 1259 OID 18924)
-- Name: date_index_w; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX date_index_w ON public.weather USING btree (date);


--
-- TOC entry 3161 (class 1259 OID 17881)
-- Name: date_pressure_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX date_pressure_index ON public.pressure USING btree (date);


--
-- TOC entry 3235 (class 1259 OID 19385)
-- Name: date_qmin4ev_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX date_qmin4ev_index ON public.qmin4ev USING btree (date);


--
-- TOC entry 3165 (class 1259 OID 17895)
-- Name: date_transmission_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX date_transmission_index ON public.transmission USING btree (date);


--
-- TOC entry 3117 (class 1259 OID 16489)
-- Name: device_a_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX device_a_index ON public.alarm USING btree (((device)::character varying));


--
-- TOC entry 3129 (class 1259 OID 16553)
-- Name: device_b_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX device_b_index ON public.battery USING btree (((device)::character varying));


--
-- TOC entry 3133 (class 1259 OID 16610)
-- Name: device_ic_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX device_ic_index ON public.infocontrato USING btree (((device)::character varying));


--
-- TOC entry 3105 (class 1259 OID 16471)
-- Name: device_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX device_index ON public.flow USING btree (((device)::character varying));


--
-- TOC entry 3226 (class 1259 OID 18972)
-- Name: device_ldds_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX device_ldds_index ON public.ldds75 USING btree (((device)::character varying));


--
-- TOC entry 3247 (class 1259 OID 20722)
-- Name: device_ng_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX device_ng_index ON public.nbiot_gps USING btree (((device)::character varying));


--
-- TOC entry 3162 (class 1259 OID 17880)
-- Name: device_pressure_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX device_pressure_index ON public.pressure USING btree (((device)::character varying));


--
-- TOC entry 3166 (class 1259 OID 17894)
-- Name: device_transmission_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX device_transmission_index ON public.transmission USING btree (((device)::character varying));


--
-- TOC entry 3110 (class 1259 OID 16480)
-- Name: device_v_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX device_v_index ON public.volume USING btree (((device)::character varying));


--
-- TOC entry 3124 (class 1259 OID 16544)
-- Name: device_v_inv_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX device_v_inv_index ON public.volume_inv USING btree (((device)::character varying));


--
-- TOC entry 3222 (class 1259 OID 18923)
-- Name: device_w_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX device_w_index ON public.weather USING btree (((device)::character varying));


--
-- TOC entry 3244 (class 1259 OID 20565)
-- Name: device_wl_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX device_wl_index ON public.water_leak USING btree (((device)::character varying));


--
-- TOC entry 3149 (class 1259 OID 17492)
-- Name: local_cli_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX local_cli_index ON public.clients USING btree (local);


--
-- TOC entry 3142 (class 1259 OID 16706)
-- Name: local_coord_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX local_coord_index ON public.coord USING btree (local);


--
-- TOC entry 3132 (class 1259 OID 16562)
-- Name: local_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX local_index ON public.dadosfaturacao USING btree (local);


--
-- TOC entry 3151 (class 1259 OID 17493)
-- Name: local_met_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX local_met_index ON public.meters USING btree (local);


--
-- TOC entry 3150 (class 1259 OID 18069)
-- Name: local_ramloc_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX local_ramloc_index ON public.clients USING btree (local);


--
-- TOC entry 3160 (class 1259 OID 17506)
-- Name: ramal_rr_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX ramal_rr_index ON public.ramaisrua USING btree (ramal);


--
-- TOC entry 3233 (class 1259 OID 19089)
-- Name: reqsodate_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX reqsodate_index ON public.reqso USING btree (date);


--
-- TOC entry 3234 (class 1259 OID 19088)
-- Name: reqsozmc_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX reqsozmc_index ON public.reqso USING btree (zmc);


--
-- TOC entry 3196 (class 1259 OID 18365)
-- Name: tag_id_qmin48_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX tag_id_qmin48_index ON public.qmin48 USING btree (tag_id);


--
-- TOC entry 3238 (class 1259 OID 19384)
-- Name: tag_id_qmin4ev_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX tag_id_qmin4ev_index ON public.qmin4ev USING btree (tag_id);


--
-- TOC entry 3177 (class 1259 OID 18172)
-- Name: tag_id_qmin_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX tag_id_qmin_index ON public.qmin USING btree (tag_id);


--
-- TOC entry 3178 (class 1259 OID 18183)
-- Name: tag_id_zmctag_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX tag_id_zmctag_index ON public.zmctag USING btree (tag_id);


--
-- TOC entry 3183 (class 1259 OID 18200)
-- Name: tag_id_zmcvol_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX tag_id_zmcvol_index ON public.zmcvol USING btree (tag_id);


--
-- TOC entry 3201 (class 1259 OID 18435)
-- Name: zmcflowdisdate_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX zmcflowdisdate_index ON public.zmcflowdis USING btree (date);


--
-- TOC entry 3202 (class 1259 OID 18434)
-- Name: zmcflowdistag_id_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX zmcflowdistag_id_index ON public.zmcflowdis USING btree (tag_id);


--
-- TOC entry 3243 (class 1259 OID 19406)
-- Name: zmcgis_data_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX zmcgis_data_index ON public.gis_data USING btree (zmc);


--
-- TOC entry 3219 (class 1259 OID 18768)
-- Name: zmcqliqdate_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX zmcqliqdate_index ON public.zmcqliq USING btree (date);


--
-- TOC entry 3220 (class 1259 OID 18767)
-- Name: zmcqliqzmc_index; Type: INDEX; Schema: public; Owner: giggo
--

CREATE INDEX zmcqliqzmc_index ON public.zmcqliq USING btree (zmc);


--
-- TOC entry 3386 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- TOC entry 3387 (class 0 OID 0)
-- Dependencies: 205
-- Name: TABLE alarm; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.alarm TO node;


--
-- TOC entry 3389 (class 0 OID 0)
-- Dependencies: 204
-- Name: SEQUENCE alarm_alarm_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.alarm_alarm_id_seq TO node;


--
-- TOC entry 3390 (class 0 OID 0)
-- Dependencies: 215
-- Name: TABLE battery; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.battery TO node;


--
-- TOC entry 3392 (class 0 OID 0)
-- Dependencies: 214
-- Name: SEQUENCE battery_battery_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.battery_battery_id_seq TO node;


--
-- TOC entry 3393 (class 0 OID 0)
-- Dependencies: 223
-- Name: TABLE clients; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.clients TO node;


--
-- TOC entry 3395 (class 0 OID 0)
-- Dependencies: 222
-- Name: SEQUENCE clients_clients_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.clients_clients_id_seq TO node;


--
-- TOC entry 3396 (class 0 OID 0)
-- Dependencies: 221
-- Name: TABLE coord; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.coord TO node;


--
-- TOC entry 3398 (class 0 OID 0)
-- Dependencies: 220
-- Name: SEQUENCE coord_coord_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.coord_coord_id_seq TO node;


--
-- TOC entry 3399 (class 0 OID 0)
-- Dependencies: 217
-- Name: TABLE dadosfaturacao; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.dadosfaturacao TO node;


--
-- TOC entry 3401 (class 0 OID 0)
-- Dependencies: 216
-- Name: SEQUENCE dadosfaturacao_dadosfaturacao_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.dadosfaturacao_dadosfaturacao_id_seq TO node;


--
-- TOC entry 3402 (class 0 OID 0)
-- Dependencies: 201
-- Name: TABLE flow; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.flow TO node;


--
-- TOC entry 3404 (class 0 OID 0)
-- Dependencies: 200
-- Name: SEQUENCE flow_flow_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.flow_flow_id_seq TO node;


--
-- TOC entry 3405 (class 0 OID 0)
-- Dependencies: 211
-- Name: TABLE flow_inv; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.flow_inv TO node;


--
-- TOC entry 3407 (class 0 OID 0)
-- Dependencies: 210
-- Name: SEQUENCE flow_inv_flow_inv_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.flow_inv_flow_inv_id_seq TO node;


--
-- TOC entry 3408 (class 0 OID 0)
-- Dependencies: 261
-- Name: TABLE georequest; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.georequest TO node;


--
-- TOC entry 3410 (class 0 OID 0)
-- Dependencies: 260
-- Name: SEQUENCE georequest_georequest_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.georequest_georequest_id_seq TO node;


--
-- TOC entry 3411 (class 0 OID 0)
-- Dependencies: 267
-- Name: TABLE gis_data; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.gis_data TO node;


--
-- TOC entry 3413 (class 0 OID 0)
-- Dependencies: 266
-- Name: SEQUENCE gis_data_gis_data_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.gis_data_gis_data_id_seq TO node;


--
-- TOC entry 3414 (class 0 OID 0)
-- Dependencies: 219
-- Name: TABLE infocontrato; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.infocontrato TO node;


--
-- TOC entry 3416 (class 0 OID 0)
-- Dependencies: 218
-- Name: SEQUENCE infocontrato_infocontrato_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.infocontrato_infocontrato_id_seq TO node;


--
-- TOC entry 3417 (class 0 OID 0)
-- Dependencies: 249
-- Name: TABLE infometers; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.infometers TO node;


--
-- TOC entry 3419 (class 0 OID 0)
-- Dependencies: 248
-- Name: SEQUENCE infometers_infometers_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.infometers_infometers_id_seq TO node;


--
-- TOC entry 3420 (class 0 OID 0)
-- Dependencies: 251
-- Name: TABLE infometerszmc; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.infometerszmc TO node;


--
-- TOC entry 3422 (class 0 OID 0)
-- Dependencies: 250
-- Name: SEQUENCE infometerszmc_infometerszmc_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.infometerszmc_infometerszmc_id_seq TO node;


--
-- TOC entry 3423 (class 0 OID 0)
-- Dependencies: 253
-- Name: TABLE kpi; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.kpi TO node;


--
-- TOC entry 3425 (class 0 OID 0)
-- Dependencies: 252
-- Name: SEQUENCE kpi_kpi_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.kpi_kpi_id_seq TO node;


--
-- TOC entry 3426 (class 0 OID 0)
-- Dependencies: 259
-- Name: TABLE ldds75; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.ldds75 TO node;


--
-- TOC entry 3428 (class 0 OID 0)
-- Dependencies: 258
-- Name: SEQUENCE ldds75_ldds75_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.ldds75_ldds75_id_seq TO node;


--
-- TOC entry 3429 (class 0 OID 0)
-- Dependencies: 225
-- Name: TABLE meters; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.meters TO node;


--
-- TOC entry 3431 (class 0 OID 0)
-- Dependencies: 224
-- Name: SEQUENCE meters_meters_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.meters_meters_id_seq TO node;


--
-- TOC entry 3432 (class 0 OID 0)
-- Dependencies: 271
-- Name: TABLE nbiot_gps; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.nbiot_gps TO node;


--
-- TOC entry 3434 (class 0 OID 0)
-- Dependencies: 270
-- Name: SEQUENCE nbiot_gps_nbiot_gps_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.nbiot_gps_nbiot_gps_id_seq TO node;


--
-- TOC entry 3435 (class 0 OID 0)
-- Dependencies: 207
-- Name: TABLE nkeaux; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.nkeaux TO node;


--
-- TOC entry 3437 (class 0 OID 0)
-- Dependencies: 206
-- Name: SEQUENCE nkeaux_nkeaux_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.nkeaux_nkeaux_id_seq TO node;


--
-- TOC entry 3438 (class 0 OID 0)
-- Dependencies: 209
-- Name: TABLE nkeauxinv; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.nkeauxinv TO node;


--
-- TOC entry 3440 (class 0 OID 0)
-- Dependencies: 208
-- Name: SEQUENCE nkeauxinv_nkeauxinv_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.nkeauxinv_nkeauxinv_id_seq TO node;


--
-- TOC entry 3441 (class 0 OID 0)
-- Dependencies: 229
-- Name: TABLE pressure; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.pressure TO node;


--
-- TOC entry 3443 (class 0 OID 0)
-- Dependencies: 228
-- Name: SEQUENCE pressure_pressure_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.pressure_pressure_id_seq TO node;


--
-- TOC entry 3444 (class 0 OID 0)
-- Dependencies: 235
-- Name: TABLE qmin; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.qmin TO node;


--
-- TOC entry 3445 (class 0 OID 0)
-- Dependencies: 245
-- Name: TABLE qmin48; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.qmin48 TO node;


--
-- TOC entry 3447 (class 0 OID 0)
-- Dependencies: 244
-- Name: SEQUENCE qmin48_qmin48_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.qmin48_qmin48_id_seq TO node;


--
-- TOC entry 3448 (class 0 OID 0)
-- Dependencies: 265
-- Name: TABLE qmin4ev; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.qmin4ev TO node;


--
-- TOC entry 3450 (class 0 OID 0)
-- Dependencies: 264
-- Name: SEQUENCE qmin4ev_qmin4ev_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.qmin4ev_qmin4ev_id_seq TO node;


--
-- TOC entry 3452 (class 0 OID 0)
-- Dependencies: 234
-- Name: SEQUENCE qmin_qmin_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.qmin_qmin_id_seq TO node;


--
-- TOC entry 3453 (class 0 OID 0)
-- Dependencies: 233
-- Name: TABLE ramaislocais; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.ramaislocais TO node;


--
-- TOC entry 3455 (class 0 OID 0)
-- Dependencies: 232
-- Name: SEQUENCE ramaislocais_ramaislocais_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.ramaislocais_ramaislocais_id_seq TO node;


--
-- TOC entry 3456 (class 0 OID 0)
-- Dependencies: 227
-- Name: TABLE ramaisrua; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.ramaisrua TO node;


--
-- TOC entry 3458 (class 0 OID 0)
-- Dependencies: 226
-- Name: SEQUENCE ramaisrua_ramaisrua_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.ramaisrua_ramaisrua_id_seq TO node;


--
-- TOC entry 3459 (class 0 OID 0)
-- Dependencies: 263
-- Name: TABLE reqso; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.reqso TO node;


--
-- TOC entry 3461 (class 0 OID 0)
-- Dependencies: 262
-- Name: SEQUENCE reqso_reqso_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.reqso_reqso_id_seq TO node;


--
-- TOC entry 3462 (class 0 OID 0)
-- Dependencies: 231
-- Name: TABLE transmission; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.transmission TO node;


--
-- TOC entry 3464 (class 0 OID 0)
-- Dependencies: 230
-- Name: SEQUENCE transmission_transmission_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.transmission_transmission_id_seq TO node;


--
-- TOC entry 3465 (class 0 OID 0)
-- Dependencies: 203
-- Name: TABLE volume; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.volume TO node;


--
-- TOC entry 3466 (class 0 OID 0)
-- Dependencies: 213
-- Name: TABLE volume_inv; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.volume_inv TO node;


--
-- TOC entry 3468 (class 0 OID 0)
-- Dependencies: 212
-- Name: SEQUENCE volume_inv_volume_inv_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.volume_inv_volume_inv_id_seq TO node;


--
-- TOC entry 3470 (class 0 OID 0)
-- Dependencies: 202
-- Name: SEQUENCE volume_volume_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.volume_volume_id_seq TO node;


--
-- TOC entry 3471 (class 0 OID 0)
-- Dependencies: 269
-- Name: TABLE water_leak; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.water_leak TO node;


--
-- TOC entry 3473 (class 0 OID 0)
-- Dependencies: 268
-- Name: SEQUENCE water_leak_water_leak_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.water_leak_water_leak_id_seq TO node;


--
-- TOC entry 3474 (class 0 OID 0)
-- Dependencies: 257
-- Name: TABLE weather; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.weather TO node;


--
-- TOC entry 3476 (class 0 OID 0)
-- Dependencies: 256
-- Name: SEQUENCE weather_weather_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.weather_weather_id_seq TO node;


--
-- TOC entry 3477 (class 0 OID 0)
-- Dependencies: 243
-- Name: TABLE zmccontratos; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.zmccontratos TO node;


--
-- TOC entry 3479 (class 0 OID 0)
-- Dependencies: 242
-- Name: SEQUENCE zmccontratos_zmccontratos_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.zmccontratos_zmccontratos_id_seq TO node;


--
-- TOC entry 3480 (class 0 OID 0)
-- Dependencies: 247
-- Name: TABLE zmcflowdis; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.zmcflowdis TO node;


--
-- TOC entry 3482 (class 0 OID 0)
-- Dependencies: 246
-- Name: SEQUENCE zmcflowdis_zmcflowdis_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.zmcflowdis_zmcflowdis_id_seq TO node;


--
-- TOC entry 3483 (class 0 OID 0)
-- Dependencies: 255
-- Name: TABLE zmcqliq; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.zmcqliq TO node;


--
-- TOC entry 3485 (class 0 OID 0)
-- Dependencies: 254
-- Name: SEQUENCE zmcqliq_zmcqliq_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.zmcqliq_zmcqliq_id_seq TO node;


--
-- TOC entry 3486 (class 0 OID 0)
-- Dependencies: 237
-- Name: TABLE zmctag; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.zmctag TO node;


--
-- TOC entry 3488 (class 0 OID 0)
-- Dependencies: 236
-- Name: SEQUENCE zmctag_zmctag_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.zmctag_zmctag_id_seq TO node;


--
-- TOC entry 3489 (class 0 OID 0)
-- Dependencies: 239
-- Name: TABLE zmcvol; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.zmcvol TO node;


--
-- TOC entry 3491 (class 0 OID 0)
-- Dependencies: 238
-- Name: SEQUENCE zmcvol_zmcvol_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.zmcvol_zmcvol_id_seq TO node;


--
-- TOC entry 3492 (class 0 OID 0)
-- Dependencies: 241
-- Name: TABLE zmcvolfat; Type: ACL; Schema: public; Owner: giggo
--

GRANT ALL ON TABLE public.zmcvolfat TO node;


--
-- TOC entry 3494 (class 0 OID 0)
-- Dependencies: 240
-- Name: SEQUENCE zmcvolfat_zmcvolfat_id_seq; Type: ACL; Schema: public; Owner: giggo
--

GRANT SELECT,USAGE ON SEQUENCE public.zmcvolfat_zmcvolfat_id_seq TO node;


-- Completed on 2024-03-28 19:10:18

--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 13.14 (Debian 13.14-0+deb11u1)
-- Dumped by pg_dump version 16.2

-- Started on 2024-03-28 19:10:18

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 2982 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2024-03-28 19:10:24

--
-- PostgreSQL database dump complete
--

-- Completed on 2024-03-28 19:10:24

--
-- PostgreSQL database cluster dump complete
--

