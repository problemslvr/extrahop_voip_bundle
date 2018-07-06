var session_opts = { expire: 300 }
var app = "SIP-App";
var average_mos_threshold = 3.0;

function dscp_lookup(dscp_decimal) {
    dscp_index = { 0: 'DF',
                   8:' CS1',
                   10:'AF11',
                   12:'AF12',
                   14:'AF13',
                   16:'CS2',
                   18:'AF21',
                   20:'AF22',
                   22:'AF23',
                   24:'CS3',
                   26:'AF31',
                   28:'AF32',
                   30:'AF33',
                   32:'CS4',
                   34:'AF41',
                   36:'AF42',
                   38:'AF43',
                   40:'CS5',
                   46:'EF',
                   48:'CS6',
                   56:'CS7'
              };

    return dscp_index[dscp_decimal]    
}


if (event === 'RTP_TICK') {
     
    if (!RTP.mos) {
        return;
    }

    var rtp_callid = RTP.callId;
    var rtp_record = {};
    rtp_record = Session.lookup(md5(rtp_callid));
    
    if (rtp_record) {
        old_record = JSON.parse(rtp_record)
        new_record = {};
        
        if (old_record.my_ipaddr1 == Flow.sender.ipaddr) {

            if (RTP.mos < old_record.mos_ip1_min) {
                new_ipaddr1_min_mos = RTP.mos;
            }
            
            else {
                new_ipaddr1_min_mos = old_record.mos_ip1_min;
            }
            
            new_record = { callID: rtp_callid,

                           my_ipaddr1: old_record.my_ipaddr1,
                           my_ipaddr2: old_record.my_ipaddr2,
                          
                           mos_ipaddr1: old_record.mos_ipaddr1 + RTP.mos,
                           mos_ipaddr2: old_record.mos_ipaddr2,

                           mos_ip1_min: new_ipaddr1_min_mos,
                           mos_ip2_min: old_record.mos_ip2_min,                          

                           jitter_ipaddr1: old_record.jitter_ipaddr1 + RTP.jitter,
                           jitter_ipaddr2: old_record.jitter_ipaddr2,

                           drops_ipaddr1: old_record.drops_ipaddr1 + RTP.drops,
                           drops_ipaddr2: old_record.drops_ipaddr2,

                           outoforderpkts_ipaddr1: old_record.outoforderpkts_ipaddr1 + RTP.outOfOrder,
                           outoforderpkts_ipaddr2: old_record.outoforderpkts_ipaddr2,
                          
                           total_packets_ipaddr1: old_record.total_packets_ipaddr1 + RTP.pkts,
                           total_packets_ipaddr2: old_record.total_packets_ipaddr2,
                          
                           rfactor_ipaddr1: old_record.rfactor_ipaddr1 + RTP.rFactor,
                           rfactor_ipaddr2: old_record.rfactor_ipaddr2,
                          
                           payloadtype: RTP.payloadType,
                           version: RTP.version,

                           dscp_ipaddr1: old_record.dscp_ipaddr1,
                           dscp_ipaddr2: old_record.dscp_ipaddr2,
                          
                           ticks_ipaddr1: old_record.ticks_ipaddr1 + 1,
                           ticks_ipaddr2: old_record.ticks_ipaddr2,                          
                         }    
            
            Session.replace(md5(rtp_callid),JSON.stringify(new_record), session_opts);
        }
        
        else if (old_record.my_ipaddr1 == Flow.receiver.ipaddr) {

            if (RTP.mos < old_record.mos_ip2_min) {
                new_ipaddr2_min_mos = RTP.mos;
            }
            
            else {
                new_ipaddr2_min_mos = old_record.mos_ip2_min;
            }            
            
            new_record = { callID: rtp_callid,

                           my_ipaddr1: old_record.my_ipaddr1,
                           my_ipaddr2: old_record.my_ipaddr2,
                          
                           mos_ipaddr1: old_record.mos_ipaddr1,
                           mos_ipaddr2: old_record.mos_ipaddr2 + RTP.mos,

                           mos_ip1_min: old_record.mos_ip1_min,
                           mos_ip2_min: new_ipaddr2_min_mos,     

                           jitter_ipaddr1: old_record.jitter_ipaddr1,
                           jitter_ipaddr2: old_record.jitter_ipaddr2 + RTP.jitter,

                           drops_ipaddr1: old_record.drops_ipaddr1,
                           drops_ipaddr2: old_record.drops_ipaddr2 + RTP.drops,

                           outoforderpkts_ipaddr1: old_record.outoforderpkts_ipaddr1,
                           outoforderpkts_ipaddr2: old_record.outoforderpkts_ipaddr2 + RTP.outOfOrder,
                          
                           total_packets_ipaddr1: old_record.total_packets_ipaddr1,
                           total_packets_ipaddr2: old_record.total_packets_ipaddr2 + RTP.pkts,                          
                          
                           rfactor_ipaddr1: old_record.rfactor_ipaddr1,
                           rfactor_ipaddr2: old_record.rfactor_ipaddr2 + RTP.rFactor,
                          
                           payloadtype: RTP.payloadType,
                           version: RTP.version,
                          
                           dscp_ipaddr1: old_record.dscp_ipaddr1,
                           dscp_ipaddr2: old_record.dscp_ipaddr2,
                          
                           ticks_ipaddr1: old_record.ticks_ipaddr1,
                           ticks_ipaddr2: old_record.ticks_ipaddr2 + 1,                          
                         }    
            
            Session.replace(md5(rtp_callid),JSON.stringify(new_record), session_opts);
        }
    }
    
    else {
        
        var rtp_record = {};
        
        rtp_record = { callID: rtp_callid,

                       my_ipaddr1: Flow.sender.ipaddr,
                       my_ipaddr2: Flow.receiver.ipaddr,
                          
                       mos_ipaddr1: RTP.mos,
                       mos_ipaddr2: 0,
                      
                       mos_ip1_min: RTP.mos,
                       mos_ip2_min: 5.00,

                       jitter_ipaddr1: RTP.jitter,
                       jitter_ipaddr2: 0,

                       drops_ipaddr1: RTP.drops,
                       drops_ipaddr2: 0,

                       outoforderpkts_ipaddr1: RTP.outOfOrder,
                       outoforderpkts_ipaddr2: 0,
                      
                       total_packets_ipaddr1: RTP.pkts,
                       total_packets_ipaddr1: 0,                      
                          
                       rfactor_ipaddr1: RTP.rFactor,
                       rfactor_ipaddr2: 0,
                          
                       payloadtype: RTP.payloadType,
                       version: RTP.version,
                      
                       dscp_ipaddr1: dscp_lookup(Flow.sender.dscp),
                       dscp_ipaddr2: dscp_lookup(Flow.receiver.dscp),

                       ticks_ipaddr1: 1,
                       ticks_ipaddr2: 0,                          
                     }    

        Session.replace(md5(rtp_callid), JSON.stringify(rtp_record), session_opts);
    }    
}


if (event === 'SIP_RESPONSE') {
    if (SIP.statusCode <= 200) {
        if (SIP.method === "INVITE") {
            /*
             * Note that SIP might send multiple INVITEs during the course
             * of a single call for operations like hold and transfers, so
             * we need some state to find the first one.
             *
             * XXX: Objects on the flow store will leak if the BYE or CANCEL
             * message is dropped.
             */
            if (Flow.store[SIP.callId] === undefined) {
                var obj = {};
                obj.callStart = getTimestamp();
                obj.from = SIP.from;
                obj.to = SIP.to;
                Flow.store[SIP.callId] = obj;
            }
        }
        else if ((SIP.method === "BYE") || (SIP.method === "CANCEL")) {

            var rec = {};
            rec.callId = SIP.callId;
            
            if (obj = Flow.store[SIP.callId]) {
                rec.from = obj.from;
                rec.to = obj.to;
                duration_ms = (getTimestamp() - obj.callStart) / 1000;
                rec.duration = Number(duration_ms.toFixed(2));
            }
            
            else {
                rec.from = SIP.from;
                rec.to = SIP.to;
                rec.duration = -1;
                log("no flow store info from: " + SIP.from + " to: " + SIP.to);
                return;
            }
            
            interim_rtp_record = JSON.parse(Session.lookup(md5(rec.callId)));
            
            if (interim_rtp_record) {
                
                final_rtp_mos_value_ipaddr1 = interim_rtp_record.mos_ipaddr1 / interim_rtp_record.ticks_ipaddr1;
                final_rtp_mos_value_ipaddr2 = interim_rtp_record.mos_ipaddr2 / interim_rtp_record.ticks_ipaddr2;
                
                if ((final_rtp_mos_value_ipaddr1 < average_mos_threshold) || (final_rtp_mos_value_ipaddr2 < average_mos_threshold)) {
                    Application(app).metricAddCount('voip-degraded-call',1); 
                    debug('WARNING: Got a degraded VoIP call');
                }
                
                final_rtp_jitter_value_ipaddr1 = interim_rtp_record.jitter_ipaddr1 / interim_rtp_record.ticks_ipaddr1;
                final_rtp_jitter_value_ipaddr2 = interim_rtp_record.jitter_ipaddr2 / interim_rtp_record.ticks_ipaddr2;
                
                final_rtp_drops_value_ipaddr1 = interim_rtp_record.drops_ipaddr1;
                final_rtp_drops_value_ipaddr2 = interim_rtp_record.drops_ipaddr2;
                
                final_rtp_outoforderpkts_value_ipaddr1 = interim_rtp_record.outoforderpkts_ipaddr1;
                final_rtp_outoforderpkts_value_ipaddr2 = interim_rtp_record.outoforderpkts_ipaddr2;        
                
                final_rtp_rfactor_value_ipaddr1 = interim_rtp_record.rfactor_ipaddr1 / interim_rtp_record.ticks_ipaddr1;
                final_rtp_rfactor_value_ipaddr2 = interim_rtp_record.rfactor_ipaddr2 / interim_rtp_record.ticks_ipaddr2;
                
                final_rtp_payloadtype_value = interim_rtp_record.payloadtype;                
                final_rtp_version_value = interim_rtp_record.version;
                final_rtp_dscp = Session.lookup(md5(Flow.client.ipaddr.toString + Flow.server.ipaddr.toString));

                rec.mos_ipaddr1 = Number(final_rtp_mos_value_ipaddr1.toFixed(2));
                rec.mos_ipaddr2 = Number(final_rtp_mos_value_ipaddr2.toFixed(2));
                
                rec.min_mos_ipaddr1 = Number(interim_rtp_record.mos_ip1_min.toFixed(2));
                rec.min_mos_ipaddr2 = Number(interim_rtp_record.mos_ip2_min.toFixed(2));                
                
                rec.jitter_ipaddr1 = Number(final_rtp_jitter_value_ipaddr1.toFixed(2));
                rec.jitter_ipaddr2 = Number(final_rtp_jitter_value_ipaddr2.toFixed(2));
                
                rec.drops_ipaddr1 = final_rtp_drops_value_ipaddr1;
                rec.drops_ipaddr2 = final_rtp_drops_value_ipaddr2;
                
                rec.outoforderpkts_ipaddr1 = final_rtp_outoforderpkts_value_ipaddr1;
                rec.outoforderpkts_ipaddr2 = final_rtp_outoforderpkts_value_ipaddr2;
                
                rec.total_packets_ipaddr1 = interim_rtp_record.total_packets_ipaddr1;
                rec.total_packets_ipaddr2 = interim_rtp_record.total_packets_ipaddr2;
                
                rec.rfactor_ipaddr1 = Number(final_rtp_rfactor_value_ipaddr1.toFixed(2));
                rec.rfactor_ipaddr2 = Number(final_rtp_rfactor_value_ipaddr2.toFixed(2));
                
                rec.payloadtype = String(final_rtp_payloadtype_value);
                rec.version = Number(final_rtp_version_value);

                rec.my_ipaddr1 = new IPAddress(interim_rtp_record.my_ipaddr1);
                rec.my_ipaddr2 = new IPAddress(interim_rtp_record.my_ipaddr2);                
                                
                rec.dscp_ipaddr1 = interim_rtp_record.dscp_ipaddr1;
                rec.dscp_ipaddr2 = interim_rtp_record.dscp_ipaddr2;
                                           
                final_voip_record = { callID: rec.callId,
                                      from: rec.from,
                                      to: rec.to,
                                      my_ipaddr1: rec.my_ipaddr1,
                                      my_ipaddr2: rec.my_ipaddr2,
                                      mos_ipaddr1: rec.mos_ipaddr1,
                                      mos_ipaddr2: rec.mos_ipaddr2,
                                      mos_min_ipaddr1: rec.min_mos_ipaddr1,
                                      mos_min_ipaddr2: rec.min_mos_ipaddr2,
                                      jitter_ipaddr1: rec.jitter_ipaddr1,
                                      jitter_ipaddr2: rec.jitter_ipaddr2,
                                      drops_ipaddr1: rec.drops_ipaddr1,
                                      drops_ipaddr2: rec.drops_ipaddr2,
                                      outoforderpkts_ipaddr1: rec.outoforderpkts_ipaddr1,
                                      outoforderpkts_ipaddr2: rec.outoforderpkts_ipaddr2,
                                      totalpkts_ipaddr1: rec.total_packets_ipaddr1,
                                      totalpkts_ipaddr2: rec.total_packets_ipaddr2,                                     
                                      rfactor_ipaddr1: rec.rfactor_ipaddr1,
                                      rfactor_ipaddr2: rec.rfactor_ipaddr2,                                     
                                      dscp_ipaddr1: rec.dscp_ipaddr1,
                                      dscp_ipaddr2: rec.dscp_ipaddr2,
                                      payloadtype: rec.payloadtype,
                                      version: rec.version,
                                      duration: rec.duration,
                                    }
            
                debug(JSON.stringify(final_voip_record));
                Session.remove(md5(rec.callId));
            }
            
            commitRecord("voip_call", rec);

            delete Flow.store[SIP.callId];
        }
    }
}
