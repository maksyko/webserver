%%%-------------------------------------------------------------------
%%% @author Admin
%%% @copyright (C) 2014, <COMPANY>
%%% @doc
%%%
%%% @end
%%% Created : 22. июл 2014 14:31
%%%-------------------------------------------------------------------
-module(orders_module).
-author("Admin").

%% API
-export([
  getAllOrders/3,
  getOrderInfo/2,
  getOrderFile/4,
  setOrderWork/3
]).

-define(URL,"http://10.1.193.201:4040").
-define(ALL_ORDERS,?URL++"/tech/rest/dt_workorders/list.json").
-define(ORDER_INFO,?URL++"/tech/rest/dt_workorders/info.json").
-define(ORDER_FILE,?URL++"/tech/rest/dt_files/get/").
-define(ORDER_WORK,?URL++"/tech/rest/dt_workorders/in-work.json").

getAllOrders(Req, Status, Dest) ->
  AccessToken = c_application:getCookie(<<"access_token">>,Req),
  Response = c_http_request:get(?ALL_ORDERS++"?status="++Status++"&destinate="++Dest++"&access_token="++binary_to_list(AccessToken)),
  Body = c_http_request:response_body(Response),
  Result = list_to_binary(Body),
  AaData = proplists:get_value(<<"aaData">>,jsx:decode(Result)),
  jsx:encode(AaData).

getOrderInfo(Req, OrderId) ->
  AccessToken = c_application:getCookie(<<"access_token">>,Req),
  Response = c_http_request:get(?ORDER_INFO++"?wo-oid="++OrderId++"&access_token="++binary_to_list(AccessToken)),
  Body = c_http_request:response_body(Response),
  Result = list_to_binary(Body),
  Result.

getOrderFile(Req, Oid, FileName, ScOid) ->
  AccessToken = c_application:getCookie(<<"access_token">>,Req),
  URL = ?ORDER_FILE++binary_to_list(Oid)++"?fileName="++FileName++"&sc_oid="++binary_to_list(ScOid)++"&access_token="++binary_to_list(AccessToken),
  Response = c_http_request:get(URL),
  Response.

setOrderWork(Req, Oid, Workgroup) ->
  AccessToken = c_application:getCookie(<<"access_token">>,Req),
  URL = ?ORDER_WORK++"?wo-oid="++Oid++"&workgroup="++Workgroup++"&access_token="++binary_to_list(AccessToken),
  Response = c_http_request:get(URL),
  true.

