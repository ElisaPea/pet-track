-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.AssociationRequest (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  senderid uuid NOT NULL,
  vetcenteremail character varying NOT NULL,
  useremail character varying NOT NULL,
  senderrole USER-DEFINED NOT NULL,
  status USER-DEFINED DEFAULT 'pending'::request_status,
  createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updatedat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  clientid uuid,
  CONSTRAINT AssociationRequest_pkey PRIMARY KEY (id),
  CONSTRAINT AssociationRequest_clientid_fkey FOREIGN KEY (clientid) REFERENCES public.Client(id)
);
CREATE TABLE public.Client (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  userid uuid,
  veterinarycenterid uuid NOT NULL,
  name character varying NOT NULL,
  email character varying NOT NULL,
  phone character varying,
  extrainfo text,
  isactive boolean,
  createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updatedat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT Client_pkey PRIMARY KEY (id),
  CONSTRAINT Client_userid_fkey FOREIGN KEY (userid) REFERENCES public.User(id),
  CONSTRAINT Client_veterinarycenterid_fkey FOREIGN KEY (veterinarycenterid) REFERENCES public.VeterinaryCenter(id),
  CONSTRAINT Client_email_veterinarycenterid_key UNIQUE (email, veterinarycenterid)
);
CREATE TABLE public.Pet (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  legalidentifier character varying UNIQUE,
  name character varying NOT NULL,
  species character varying,
  breed character varying,
  birthdate date,
  isverified boolean DEFAULT false,
  createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updatedat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  weight integer,
  vaccines boolean,
  CONSTRAINT Pet_pkey PRIMARY KEY (id)
);
CREATE TABLE public.PetClient (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  petid uuid NOT NULL,
  clientid uuid NOT NULL,
  extrafields text,
  createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updatedat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT PetClient_pkey PRIMARY KEY (id),
  CONSTRAINT PetClient_petid_fkey FOREIGN KEY (petid) REFERENCES public.Pet(id),
  CONSTRAINT PetClient_clientid_fkey FOREIGN KEY (clientid) REFERENCES public.Client(id)
);
CREATE TABLE public.PetUser (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  petid uuid NOT NULL,
  userid uuid NOT NULL,
  extrafields text,
  createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updatedat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT PetUser_pkey PRIMARY KEY (id),
  CONSTRAINT PetUser_petid_fkey FOREIGN KEY (petid) REFERENCES public.Pet(id),
  CONSTRAINT PetUser_userid_fkey FOREIGN KEY (userid) REFERENCES public.User(id)
);
CREATE TABLE public.Professional (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  userid uuid NOT NULL,
  veterinarycenterid uuid,
  licensenumber character varying,
  createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updatedat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT Professional_pkey PRIMARY KEY (id),
  CONSTRAINT Professional_userid_fkey FOREIGN KEY (userid) REFERENCES public.User(id),
  CONSTRAINT Professional_veterinarycenterid_fkey FOREIGN KEY (veterinarycenterid) REFERENCES public.VeterinaryCenter(id)
);
CREATE TABLE public.User (
  id uuid NOT NULL,
  name character varying NOT NULL,
  phone character varying,
  role USER-DEFINED DEFAULT 'user'::user_role,
  createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  lgpdconsent boolean DEFAULT false,
  lgpdconsentdate timestamp without time zone,
  isactive boolean,
  deletedat timestamp without time zone,
  updatedat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT User_pkey PRIMARY KEY (id),
  CONSTRAINT User_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.VeterinaryCenter (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email character varying NOT NULL UNIQUE,
  name character varying,
  address character varying,
  phone character varying,
  createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updatedat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT VeterinaryCenter_pkey PRIMARY KEY (id)
);