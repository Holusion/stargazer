// hello.cc
#include <vector>
#include <sstream>
#include <string>
#include <node.h>
#include <nan.h>
#include <uv.h>
#include <node_object_wrap.h>
#include "dns_sd.h"

namespace {

	using v8::Function;
	using v8::Local;
	using v8::Number;
	using v8::Value;
	using Nan::To;
	using Nan::New;

//from https://github.com/bnoordhuis/node-event-emitter/blob/master/event-emitter.cc

class BonjourListener : public Nan::ObjectWrap  {
 public:
	 static NAN_MODULE_INIT(Init) {
		v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(New);
		tpl->SetClassName(Nan::New("BonjourListener").ToLocalChecked());
		tpl->InstanceTemplate()->SetInternalFieldCount(1);

		Nan::SetPrototypeMethod(tpl, "getHandle", GetHandle);
		//Nan::SetPrototypeMethod(tpl, "list", List);
		//Nan::SetPrototypeMethod(tpl, "getValue", GetValue);

		constructor().Reset(Nan::GetFunction(tpl).ToLocalChecked());
		Nan::Set(target, Nan::New("BonjourListener").ToLocalChecked(),
			Nan::GetFunction(tpl).ToLocalChecked());
	}
  DNSServiceRef client;
	Nan::Callback listener;
	static std::vector<std::string> add_pending;
	static std::vector<std::string> remove_pending;
 private:
  explicit BonjourListener( v8::Local<v8::Function> f): client(0), listener(f){
		char *typ = "_http._tcp", *dom = "";//Use default domain
		DNSServiceFlags flags = 0;
		DNSServiceErrorType err;
	  static uint32_t opinterface = kDNSServiceInterfaceIndexAny;
	  err = DNSServiceBrowse(&client, flags, opinterface, typ, dom, BrowserCallBack, NULL);
	  if (err != kDNSServiceErr_NoError)  {
			printf("Browse returned : %d\n",err);
			return;
		}
		//Here we either synchronously HandleEvents() or set up a libuv poll
	  //HandleEvents();
		if (! DNSServiceRefSockFD(client   )){
			printf("Bad fd");
			return;
		}
		poll_handle.data = this;
		err = uv_poll_init_socket(uv_default_loop(), &poll_handle,  DNSServiceRefSockFD(client   ));
		if (err ){
			printf("init_socket error : %s\n",uv_strerror(err));
			return;
		}
		err = uv_poll_start( &poll_handle,  UV_READABLE, on_data );
		if (err ){
			printf("poll_start error : %s\n",uv_strerror(err));
			return;
		}
		printf("event loop OK\n");
	}

  ~BonjourListener(){
		if (client   ) DNSServiceRefDeallocate(client   );
		free(poll_handle.data);
		uv_poll_stop(&poll_handle);
	}

	static void on_data(uv_poll_t* handle, int status, int events){
  	Nan::HandleScope scope;
		std::stringstream str;
		BonjourListener *obj = (BonjourListener *)handle->data;
		DNSServiceProcessResult(obj->client);
		if (0 < add_pending.size() + remove_pending.size()){
			while (!add_pending.empty()) {
				str << "add " << add_pending.back() << "\n";
				add_pending.pop_back();
			}
			while (!remove_pending.empty()) {
				str << "rm " << remove_pending.back() << "\n";
				remove_pending.pop_back();
			}
			Local<Value> argv[] = {
				Nan::New<v8::String>(str.str()).ToLocalChecked()
			};
			obj->listener.Call(1, argv);
		}

	};
	static void DNSSD_API	BrowserCallBack(
		DNSServiceRef		inServiceRef,
		DNSServiceFlags		inFlags,
		uint32_t			inIFI, //found on interface
		DNSServiceErrorType	inError,
		const char *		inName, //host name
		const char *		inType, //service type
		const char *		inDomain, //domain
		void *				inContext
	){
		(void) inServiceRef;	// Unused
		(void) inContext;		// Unused
		if( inError == kDNSServiceErr_NoError )	{
			if( inFlags & kDNSServiceFlagsAdd ){
				add_pending.push_back(inName);
			}	else{
				remove_pending.push_back(inName);
			}
			if( inFlags & kDNSServiceFlagsMoreComing ){
				printf("partial infos\n");
				//more info comming
			}
			//FIXME print infos
			//fprintf( stderr, "%s %30s.%s%s on interface %d\n", action, inName, inType, inDomain, (int) inIFI );
		}	else {
			fprintf( stderr, "Bonjour browser error occurred: %d\n", inError );
		}
	}
	static NAN_METHOD(New) {
		if (info.IsConstructCall()) {
			//Local<Function> value = info[0]->IsUndefined() ? nullptr : Nan::To<Function>(info[0]).FromJust();
			BonjourListener *obj = new BonjourListener(To<Function>(info[0]).ToLocalChecked());
			obj->Wrap(info.This());
			info.GetReturnValue().Set(info.This());
		} else {
			const int argc = 1;
		 	v8::Local<v8::Value> argv[argc] = {info[0]};
		 	v8::Local<v8::Function> cons = Nan::New(constructor());
		 	info.GetReturnValue().Set(cons->NewInstance(argc, argv));
		}
	}

	static NAN_METHOD(GetHandle) {
		BonjourListener* obj = Nan::ObjectWrap::Unwrap<BonjourListener>(info.Holder());
		info.GetReturnValue().Set(obj->handle());
	}
	/*
	//GET the address of a product Need to be cancelled
	// Use kDNSServiceFlagsTimeout for this?
	// Maybe it needs it's own wrapper object. The lifecycle is non-trivial  here
	static NAN_METHOD(GetAddress) {
		BonjourListener* obj = Nan::ObjectWrap::Unwrap<BonjourListener>(info.Holder());
		Callback cb(To<Function>(info[0]).ToLocalChecked());
		int err = DNSServiceGetAddrInfo(&client, kDNSServiceFlagsReturnIntermediates, opinterface, GetProtocol(argv[opi+0]), argv[opi+1], addrinfo_reply, this);
		info.GetReturnValue().Set(obj->handle());
	}
	//*/
	static inline Nan::Persistent<v8::Function> & constructor() {
		static Nan::Persistent<v8::Function> my_constructor;
		return my_constructor;
	}
	uv_poll_t poll_handle;
};

std::vector<std::string> BonjourListener::remove_pending = std::vector<std::string>();
std::vector<std::string> BonjourListener::add_pending = std::vector<std::string>();

NODE_MODULE(objectwrapper, BonjourListener::Init)
} // anonymous namespace
