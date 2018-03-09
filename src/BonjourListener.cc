// hello.cc
#include <memory>
#include <utility>
#include <set>
#include <sstream>
#include <string>
#include <node.h>
#include <nan.h>
#include <uv.h>
#include <net/if.h> //IF_NAMESIZE
#include <node_object_wrap.h>
#include "dns_sd.h"


#define typ "_workstation._tcp"
#define dom "" //Use default domain


namespace {

	using v8::Function;
	using v8::Local;
	using v8::Number;
	using v8::Value;
	using Nan::To;
	using Nan::New;

using resolve_cb_t = void(*)(char*, char*);

class Poller{
public:
	Poller():client(0){
		poll_handle.data = this;
	}
	~Poller(){
		uv_poll_stop(&poll_handle);
		if (0 < DNSServiceRefSockFD(client)){
			DNSServiceRefDeallocate(client   );
		}
	}
	int start(){
		int err;
		err = uv_poll_init_socket(uv_default_loop(), &poll_handle,  DNSServiceRefSockFD(client   ));
		if (err ){
			printf("init_socket error : %s\n",uv_strerror(err));
			return err;
		}
		err = uv_poll_start( &poll_handle,  UV_READABLE, on_data );
		return err;
	}
	static void on_data(uv_poll_t* handle, int status, int events){
		Poller *obj = (Poller *)handle->data;
		DNSServiceProcessResult(obj->client);
	}
	DNSServiceRef client;
	uv_poll_t poll_handle;
};



class Addresser: public Poller{
public:
	Addresser(uint32_t interfaceIndex, const char *hostname):
		Poller(), hostname(hostname)
	{
		DNSServiceErrorType err;
		printf("Start adresser for : %s\n",hostname);
		DNSServiceGetAddrInfo(&client, 0, interfaceIndex, 0, hostname, AddresserCallback, this);
		if (err ){
			printf("Error getting client address : %d\n",err);
		}
		start();
	}

	~Addresser(){
	}
	friend bool operator< (const Addresser& l, const Addresser& r){ return l.hostname < r.hostname; }
	friend bool operator< (const Addresser& l, const std::string& str){ return l.hostname < str; }
	friend bool operator==(const Addresser& l, const Addresser& r){ return l.hostname == r.hostname; }
	friend bool operator!=(const Addresser& l, const Addresser& r){ return !(l == r); }
private:
	static void DNSSD_API AddresserCallback (
		DNSServiceRef sdRef,
		DNSServiceFlags flags,
		uint32_t interfaceIndex,
		DNSServiceErrorType errorCode,
		const char *hostname,
		const struct sockaddr *address,
		uint32_t ttl,
		void *context)
	{
		(void) sdRef;
		char addr[256] = "";
		Addresser * obj = (Addresser*)context;
		const char *op = (flags & kDNSServiceFlagsAdd) ? "Add" : "Rmv";
		if (address && address->sa_family == AF_INET) {
			const unsigned char *b = (const unsigned char *) &((struct sockaddr_in *)address)->sin_addr;
			snprintf(addr, sizeof(addr), "%d.%d.%d.%d", b[0], b[1], b[2], b[3]);
		}	else if (address && address->sa_family == AF_INET6){
			char if_name[IF_NAMESIZE];		// Older Linux distributions don't define IF_NAMESIZE
			const struct sockaddr_in6 *s6 = (const struct sockaddr_in6 *)address;
			const unsigned char       *b  = (const unsigned char *      )&s6->sin6_addr;
			if (!if_indextoname(s6->sin6_scope_id, if_name))
				snprintf(if_name, sizeof(if_name), "<%d>", s6->sin6_scope_id);
			snprintf(addr, sizeof(addr), "%02X%02X:%02X%02X:%02X%02X:%02X%02X:%02X%02X:%02X%02X:%02X%02X:%02X%02X%%%s",
					b[0x0], b[0x1], b[0x2], b[0x3], b[0x4], b[0x5], b[0x6], b[0x7],
					b[0x8], b[0x9], b[0xA], b[0xB], b[0xC], b[0xD], b[0xE], b[0xF], if_name);
		}
		printf("%s%6X%3d %-25s %-44s %d", op, flags, interfaceIndex, hostname, addr, ttl);

	}
	std::string hostname;
};

class Resolver: public Poller{
public:
	Resolver(uint32_t interfaceIndex, const char *name):
		Poller(), name(name)
	{
		DNSServiceErrorType err;
		printf("Start resolver for : %s\n",name);
		DNSServiceResolve(&client, kDNSServiceInterfaceIndexAny, interfaceIndex, name, typ, dom, ResolverCallback, this);
		if (err ){
			printf("Error resolving client : %d\n",err);
		}
		start();
	}

	~Resolver(){
	}
	friend bool operator< (const Resolver& l, const Resolver& r){ return l.name < r.name; }
	friend bool operator< (const Resolver& l, const std::string& str){ return l.name < str; }
	friend bool operator==(const Resolver& l, const Resolver& r){ return l.name == r.name; }
	friend bool operator!=(const Resolver& l, const Resolver& r){ return !(l == r); }
private:
	static void DNSSD_API ResolverCallback (
			DNSServiceRef                       sdRef,
			DNSServiceFlags                     flags,
			uint32_t                            interfaceIndex,
			DNSServiceErrorType                 errorCode,
			const char                          *fullname,
			const char                          *hosttarget,
			uint16_t                            port,        /* In network byte order */
			uint16_t                            txtLen,
			const unsigned char                 *txtRecord,
			void                                *context
	) {
		Resolver * obj = (Resolver*)context;
		printf("Resolved : %s - %s\n",fullname, hosttarget);
	}
	std::string name;
};

class BonjourListener : public Nan::ObjectWrap, public Poller  {
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
	Nan::Callback listener;
	std::set<Resolver> resolvers;

 private:
  explicit BonjourListener( v8::Local<v8::Function> f): Poller(), listener(f), resolvers(){

		DNSServiceFlags flags = 0;
		DNSServiceErrorType err;
	  static uint32_t opinterface = kDNSServiceInterfaceIndexAny;
	  err = DNSServiceBrowse(&client, flags, opinterface, typ, dom, BrowserCallBack, this);
	  if (err != kDNSServiceErr_NoError)  {
			printf("Browse returned : %d\n",err);
			return;
		}
		if (! DNSServiceRefSockFD(client   )){
			printf("Bad fd");
			return;
		}
		start();
	}

  ~BonjourListener(){
	}

	static void DNSSD_API	BrowserCallBack (
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
		BonjourListener* obj = (BonjourListener*) inContext;
		if( inError == kDNSServiceErr_NoError )	{

			if( inFlags & kDNSServiceFlagsAdd ){
				obj->resolvers.emplace(inIFI, inName);
			}	else{
				//FIXME find a way to delete properly
				//obj->resolvers.erase(obj->resolvers.find(inName))
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
		Nan::Callback cb(To<Function>(info[0]).ToLocalChecked());

	}
	//*/
	static inline Nan::Persistent<v8::Function> & constructor() {
		static Nan::Persistent<v8::Function> my_constructor;
		return my_constructor;
	}
	uv_poll_t poll_handle;
};


NODE_MODULE(objectwrapper, BonjourListener::Init)
} // anonymous namespace
