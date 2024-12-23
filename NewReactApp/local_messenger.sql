PGDMP  3    "    
        
    |            local_messenger    16.3    16.3 "    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16398    local_messenger    DATABASE     �   CREATE DATABASE local_messenger WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE local_messenger;
                postgres    false            �            1259    16424    friends    TABLE     �   CREATE TABLE public.friends (
    user_id integer NOT NULL,
    friend_id integer NOT NULL,
    status character varying(50)
);
    DROP TABLE public.friends;
       public         heap    postgres    false            �            1259    16440    individual_messages    TABLE     �   CREATE TABLE public.individual_messages (
    id integer NOT NULL,
    sender_id integer,
    receiver_id integer,
    content text NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now()
);
 '   DROP TABLE public.individual_messages;
       public         heap    postgres    false            �            1259    16439    individual_messages_id_seq    SEQUENCE     �   CREATE SEQUENCE public.individual_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.individual_messages_id_seq;
       public          postgres    false    221            �           0    0    individual_messages_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.individual_messages_id_seq OWNED BY public.individual_messages.id;
          public          postgres    false    220            �            1259    16412    messages    TABLE     �   CREATE TABLE public.messages (
    id integer NOT NULL,
    text character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.messages;
       public         heap    postgres    false            �            1259    16411    messages_id_seq    SEQUENCE     �   CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.messages_id_seq;
       public          postgres    false    218            �           0    0    messages_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;
          public          postgres    false    217            �            1259    16405    users    TABLE     �   CREATE TABLE public.users (
    id_user smallint NOT NULL,
    username character varying(50),
    password character varying(50)
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    16404    users_id_user_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_user_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.users_id_user_seq;
       public          postgres    false    216            �           0    0    users_id_user_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.users_id_user_seq OWNED BY public.users.id_user;
          public          postgres    false    215            +           2604    16443    individual_messages id    DEFAULT     �   ALTER TABLE ONLY public.individual_messages ALTER COLUMN id SET DEFAULT nextval('public.individual_messages_id_seq'::regclass);
 E   ALTER TABLE public.individual_messages ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    221    220    221            )           2604    16415    messages id    DEFAULT     j   ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);
 :   ALTER TABLE public.messages ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    218    218            (           2604    16408    users id_user    DEFAULT     n   ALTER TABLE ONLY public.users ALTER COLUMN id_user SET DEFAULT nextval('public.users_id_user_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN id_user DROP DEFAULT;
       public          postgres    false    216    215    216            �          0    16424    friends 
   TABLE DATA           =   COPY public.friends (user_id, friend_id, status) FROM stdin;
    public          postgres    false    219   .(       �          0    16440    individual_messages 
   TABLE DATA           _   COPY public.individual_messages (id, sender_id, receiver_id, content, "timestamp") FROM stdin;
    public          postgres    false    221   ](       �          0    16412    messages 
   TABLE DATA           8   COPY public.messages (id, text, created_at) FROM stdin;
    public          postgres    false    218   �(       �          0    16405    users 
   TABLE DATA           <   COPY public.users (id_user, username, password) FROM stdin;
    public          postgres    false    216   ]*       �           0    0    individual_messages_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.individual_messages_id_seq', 44, true);
          public          postgres    false    220            �           0    0    messages_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.messages_id_seq', 20, true);
          public          postgres    false    217            �           0    0    users_id_user_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.users_id_user_seq', 30, true);
          public          postgres    false    215            2           2606    16428    friends friends_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.friends
    ADD CONSTRAINT friends_pkey PRIMARY KEY (user_id, friend_id);
 >   ALTER TABLE ONLY public.friends DROP CONSTRAINT friends_pkey;
       public            postgres    false    219    219            4           2606    16448 ,   individual_messages individual_messages_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.individual_messages
    ADD CONSTRAINT individual_messages_pkey PRIMARY KEY (id);
 V   ALTER TABLE ONLY public.individual_messages DROP CONSTRAINT individual_messages_pkey;
       public            postgres    false    221            0           2606    16418    messages messages_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.messages DROP CONSTRAINT messages_pkey;
       public            postgres    false    218            .           2606    16410    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id_user);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    216            5           2606    16434    friends friends_friend_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.friends
    ADD CONSTRAINT friends_friend_id_fkey FOREIGN KEY (friend_id) REFERENCES public.users(id_user);
 H   ALTER TABLE ONLY public.friends DROP CONSTRAINT friends_friend_id_fkey;
       public          postgres    false    216    4654    219            6           2606    16429    friends friends_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.friends
    ADD CONSTRAINT friends_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id_user);
 F   ALTER TABLE ONLY public.friends DROP CONSTRAINT friends_user_id_fkey;
       public          postgres    false    216    219    4654            7           2606    16454 8   individual_messages individual_messages_receiver_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.individual_messages
    ADD CONSTRAINT individual_messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id_user);
 b   ALTER TABLE ONLY public.individual_messages DROP CONSTRAINT individual_messages_receiver_id_fkey;
       public          postgres    false    4654    221    216            8           2606    16464 9   individual_messages individual_messages_receiver_id_fkey1    FK CONSTRAINT     �   ALTER TABLE ONLY public.individual_messages
    ADD CONSTRAINT individual_messages_receiver_id_fkey1 FOREIGN KEY (receiver_id) REFERENCES public.users(id_user);
 c   ALTER TABLE ONLY public.individual_messages DROP CONSTRAINT individual_messages_receiver_id_fkey1;
       public          postgres    false    221    216    4654            9           2606    16449 6   individual_messages individual_messages_sender_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.individual_messages
    ADD CONSTRAINT individual_messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id_user);
 `   ALTER TABLE ONLY public.individual_messages DROP CONSTRAINT individual_messages_sender_id_fkey;
       public          postgres    false    221    4654    216            :           2606    16459 7   individual_messages individual_messages_sender_id_fkey1    FK CONSTRAINT     �   ALTER TABLE ONLY public.individual_messages
    ADD CONSTRAINT individual_messages_sender_id_fkey1 FOREIGN KEY (sender_id) REFERENCES public.users(id_user);
 a   ALTER TABLE ONLY public.individual_messages DROP CONSTRAINT individual_messages_sender_id_fkey1;
       public          postgres    false    221    216    4654            �      x�3�4�LLNN-(IM�2�46@�b���� �.Y      �   �   x�m�1
A@�zr����$�dfR�g��d-E���+z�]dA,~��J�SI�C���,Kd	"��
(o�ӱ���hF^@e�>���ۮub
���*�����rݙO\�r�4��c�/���2&$�Z� +I,�      �   X  x�}�AN1E��)r�F��I6l*��`�&t:�U����8=)B@��w����������0�:`����b*���9�a���mS���Nv�OS}��{#���I,q),.�C0��~	�B�5J4
���6Ͷ���ކ��8||��l���u��&�k�x8�t�"Z��n)#F��q)*�jf
�~��x>�l��Ȓt� ��̀3�0�o���B�L�kui<tS�H*�Nb`nH��Z��4��ZLt^)#�����/��A�����ܚ ���0� �g�����[�%�Y�,�p�Ee���DEb	�ea��0�X�毶�ա��c>�ь�      �   D   x�3���,�,�4110�07�fF\�QC4a#N��NC#Ccc.cΒ��N##SK#�=... �@�     