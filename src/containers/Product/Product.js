import './Product.css'
import BadProductIPFound from '../../errors/BadProductIPFound'
import Playlist from '../../components/Playlist';
import PropTypes from 'prop-types'
import React from 'react'
import {dispatchError} from '../../store'
import net from "net";


export default class Product extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            playlist: []
        }
    }

    componentDidMount() {
        let addr = null;
        if(process.platform === "win32") {
            for(let a of this.props.product.addresses) {
                if(net.isIP(a) == 4) {
                    addr = a;
                }
            }
    
            // Fetch can't parse ipv6 addresses
            switch (net.isIP(addr)) {
                case 6:
                    addr = `[${addr}]:3000`;
                    break;
                case 0:
                    dispatchError(new BadProductIPFound(this.props.product.name, addr));
                    break;
                default:
            }
        } else {
            addr = `${this.props.product.name}.local`;
        }
    }

    render() {
        const items = [
            {
              "name": "lille-biotope-leve-17",
              "rank": 0,
              "active": false,
              "_id": "ohtkoDZhvw18mu7e"
            },
            {
              "name": "rives-haute-deule",
              "rank": 0,
              "active": false,
              "_id": "Bok0tNXqXDJlUcig"
            },
            {
              "name": "Seven.mp4",
              "path": "/home/user/medias/Seven.mp4",
              "rank": 4,
              "active": false,
              "_id": "mCUdTNgjYwmQ6KID"
            },
            {
              "name": "CTG_1080p.mp4",
              "path": "/home/user/medias/CTG_1080p.mp4",
              "rank": 8,
              "active": false,
              "_id": "UciyQwSoa3hDV1GJ"
            },
            {
              "name": "BouyguesImmo_Text_Bas.mp4",
              "path": "/home/user/medias/BouyguesImmo_Text_Bas.mp4",
              "rank": 12,
              "active": false,
              "_id": "Cnl1mnWO97r8nmKt"
            },
            {
              "name": "fibule2.mp4",
              "path": "/home/user/medias/fibule2.mp4",
              "rank": 12,
              "active": false,
              "_id": "8FBMSUyMWixhIYOE"
            },
            {
              "name": "SMART_Compo_V2.mp4",
              "path": "/home/user/medias/SMART_Compo_V2.mp4",
              "rank": 13,
              "active": false,
              "_id": "K7BJ3UNEfO3zO1cu"
            },
            {
              "name": "BASF_DEF.mp4",
              "path": "/home/user/medias/BASF_DEF.mp4",
              "rank": 14,
              "active": false,
              "_id": "fpp1IfxKiAJcAEjO"
            },
            {
              "name": "button",
              "path": "/home/user/medias/button/manage",
              "rank": 15,
              "active": false,
              "_id": "nFcslRY0WlNG5Aqj"
            },
            {
              "name": "APF_LOGO_Anm.mp4",
              "path": "/home/user/medias/APF_LOGO_Anm.mp4",
              "rank": 16,
              "active": false,
              "_id": "RzSWvLzwxuNRmwHm"
            },
            {
              "name": "NotreDameHD.mp4",
              "path": "/home/user/medias/NotreDameHD.mp4",
              "rank": 16,
              "active": false,
              "_id": "AX57uKV7fqaZTVH2"
            },
            {
              "name": "gare_v1.mp4",
              "path": "/home/user/medias/gare_v1.mp4",
              "rank": 17,
              "active": false,
              "_id": "iSkuGXlksrwZJVlC"
            },
            {
              "name": "Oxelo_Anm_pliage.mp4",
              "path": "/home/user/medias/Oxelo_Anm_pliage.mp4",
              "rank": 18,
              "active": false,
              "_id": "f78g3KzD9ophzFZp"
            },
            {
              "name": "Oxelo_Anm_Occlusion.mp4",
              "path": "/home/user/medias/Oxelo_Anm_Occlusion.mp4",
              "rank": 19,
              "active": false,
              "_id": "xQ4vnNq2PrpDpODK"
            },
            {
              "name": "BASF_Rework_01.mp4",
              "path": "/home/user/medias/BASF_Rework_01.mp4",
              "rank": 20,
              "active": false,
              "_id": "kCZD6TQR7h3qCcLA"
            },
            {
              "name": "BASF_Rework_02.mp4",
              "path": "/home/user/medias/BASF_Rework_02.mp4",
              "rank": 21,
              "active": false,
              "_id": "LBJ27iQTnGBABp0e"
            },
            {
              "name": "Electricx2.mp4",
              "path": "/home/user/medias/Electricx2.mp4",
              "rank": 22,
              "active": false,
              "_id": "1E68XyfKKushcFc5"
            },
            {
              "name": "igecav.mp4",
              "path": "/home/user/medias/igecav.mp4",
              "rank": 23,
              "active": false,
              "_id": "JFCMyZSjTgbmJZ9C"
            },
            {
              "name": "StillFrame.mp4",
              "path": "/home/user/medias/StillFrame.mp4",
              "rank": 24,
              "active": false,
              "_id": "eJ61Sc1XUuyRyWUO"
            },
            {
              "name": "Test_Compo_02.mp4",
              "path": "/home/user/medias/Test_Compo_02.mp4",
              "rank": 25,
              "active": false,
              "_id": "X99mufUmHPqWJUq0"
            },
            {
              "name": "Compo_Prix_V1.mp4",
              "path": "/home/user/medias/Compo_Prix_V1.mp4",
              "rank": 26,
              "active": false,
              "_id": "sCPtJwvkjgBHbR3f"
            },
            {
              "name": "Compo_Electric_V1.mp4",
              "path": "/home/user/medias/Compo_Electric_V1.mp4",
              "rank": 27,
              "active": false,
              "_id": "R5XRqihOD2gqEsZY"
            },
            {
              "name": "Compo_Breakdown_V1.mp4",
              "path": "/home/user/medias/Compo_Breakdown_V1.mp4",
              "rank": 28,
              "active": false,
              "_id": "bGg4svzpkCFS72hH"
            },
            {
              "name": "BaudroieV5 - Copy.mp4",
              "path": "/home/user/medias/BaudroieV5 - Copy.mp4",
              "rank": 29,
              "active": false,
              "_id": "aJE3OpTARpBH1JXk"
            },
            {
              "name": "Compo_Pliage_V1.mp4",
              "path": "/home/user/medias/Compo_Pliage_V1.mp4",
              "rank": 29,
              "active": false,
              "_id": "HqADx6N25a8BnCoi"
            },
            {
              "name": "BASF_REWORK_SON_V1.mp4",
              "path": "/home/user/medias/BASF_REWORK_SON_V1.mp4",
              "rank": 30,
              "active": false,
              "_id": "SoUUlFywTILUrBs5"
            },
            {
              "name": "Groupe6_Rendu_Gare_V3.mp4",
              "path": "/home/user/medias/Groupe6_Rendu_Gare_V3.mp4",
              "rank": 31,
              "active": false,
              "_id": "GD0Et8woSgzo8DlG"
            },
            {
              "name": "BASF_REWORK_SON_V3.mp4",
              "path": "/home/user/medias/BASF_REWORK_SON_V3.mp4",
              "rank": 32,
              "active": false,
              "_id": "fOhOf4Yx6pPFQqer"
            },
            {
              "name": "BASF_REWORK_SON_Chapitre03_Robustesse.mp4",
              "path": "/home/user/medias/BASF_REWORK_SON_Chapitre03_Robustesse.mp4",
              "rank": 33,
              "active": false,
              "_id": "uY30hnO8uzRsyuSH"
            },
            {
              "name": "BASF_REWORK_SON_V4.mp4",
              "path": "/home/user/medias/BASF_REWORK_SON_V4.mp4",
              "rank": 34,
              "active": false,
              "_id": "9cp7AGkEbIzBN1QV"
            },
            {
              "name": "Quartz_HD.mp4",
              "path": "/home/user/medias/Quartz_HD.mp4",
              "rank": 34,
              "active": false,
              "_id": "3QiJDuqGzXmeH16e"
            },
            {
              "name": "Quartz_HD_Elec.mp4",
              "path": "/home/user/medias/Quartz_HD_Elec.mp4",
              "rank": 35,
              "active": false,
              "_id": "47CDGvHESWI8HaJr"
            },
            {
              "name": "trilobite.mp4",
              "path": "/home/user/medias/trilobite.mp4",
              "rank": 35,
              "active": false,
              "_id": "rERIrikLf0R7QEJ9"
            },
            {
              "name": "2800bis.mp4",
              "path": "/home/user/medias/2800bis.mp4",
              "rank": 36,
              "active": false,
              "_id": "ri8jKqj4ZCKMywoO"
            },
            {
              "name": "Moelnlycke_02.mp4",
              "path": "/home/user/medias/Moelnlycke_02.mp4",
              "rank": 36,
              "active": false,
              "_id": "2jDNUX9nxE3flBzH"
            },
            {
              "name": "03_Archipel_V4_VINCI.mp4",
              "path": "/home/user/medias/03_Archipel_V4_VINCI.mp4",
              "rank": 37,
              "active": false,
              "_id": "Mbrz3fKnlg6BjgD8"
            },
            {
              "name": "E25654.mp4",
              "path": "/home/user/medias/E25654.mp4",
              "rank": 37,
              "active": false,
              "_id": "3reuCFSHVg4jS9Fb"
            },
            {
              "name": "L2473.mp4",
              "path": "/home/user/medias/L2473.mp4",
              "rank": 38,
              "active": false,
              "_id": "1Rxq5wFnRBioWGzL"
            },
            {
              "name": "Microscope.mp4",
              "path": "/home/user/medias/Microscope.mp4",
              "rank": 38,
              "active": false,
              "_id": "Mu20KKrhxZM1eHtZ"
            },
            {
              "name": "ME354.mp4",
              "path": "/home/user/medias/ME354.mp4",
              "rank": 39,
              "active": false,
              "_id": "n0PWfCCv0DSNVJEY"
            },
            {
              "name": "SPBANT55.mp4",
              "path": "/home/user/medias/SPBANT55.mp4",
              "rank": 40,
              "active": false,
              "_id": "x3kZdIMlagJp61sL"
            },
            {
              "name": "RydersCup_Compositing_V4.mp4",
              "path": "/home/user/medias/RydersCup_Compositing_V4.mp4",
              "rank": 41,
              "active": false,
              "_id": "KMh9V2Oml34C3eTu"
            },
            {
              "name": "los.mp4",
              "path": "/home/user/medias/los.mp4",
              "rank": 45,
              "active": false,
              "_id": "MvmwUbTRw8o5xHxi"
            },
            {
              "name": "manpack.mp4",
              "path": "/home/user/medias/manpack.mp4",
              "rank": 46,
              "active": false,
              "_id": "EI2XBdQ7noXLi6Yn"
            },
            {
              "name": "mistral.mp4",
              "path": "/home/user/medias/mistral.mp4",
              "rank": 47,
              "active": false,
              "_id": "v7pLTq7rcaKma2to"
            },
            {
              "name": "modem_3.mp4",
              "path": "/home/user/medias/modem_3.mp4",
              "rank": 48,
              "active": false,
              "_id": "EYDJteznucvtPRan"
            },
            {
              "name": "modemAir.mp4",
              "path": "/home/user/medias/modemAir.mp4",
              "rank": 49,
              "active": false,
              "_id": "b65IoC6CVc3iY5vV"
            },
            {
              "name": "ModemCore.mp4",
              "path": "/home/user/medias/ModemCore.mp4",
              "rank": 50,
              "active": false,
              "_id": "H0hGtP4fB9XFE2bW"
            },
            {
              "name": "modemField.mp4",
              "path": "/home/user/medias/modemField.mp4",
              "rank": 51,
              "active": false,
              "_id": "3E5tpEJ75qGZ5K9Z"
            },
            {
              "name": "mq9.mp4",
              "path": "/home/user/medias/mq9.mp4",
              "rank": 52,
              "active": false,
              "_id": "ga8jscbtJchH1Jq7"
            },
            {
              "name": "otm.mp4",
              "path": "/home/user/medias/otm.mp4",
              "rank": 53,
              "active": false,
              "_id": "4BAQG9bqjy9mldPv"
            },
            {
              "name": "otm1.mp4",
              "path": "/home/user/medias/otm1.mp4",
              "rank": 54,
              "active": false,
              "_id": "YfrmCtapcGQDMjnn"
            },
            {
              "name": "otp.mp4",
              "path": "/home/user/medias/otp.mp4",
              "rank": 55,
              "active": false,
              "_id": "BqsLpNTCOIaRwLeq"
            },
            {
              "name": "surfsat.mp4",
              "path": "/home/user/medias/surfsat.mp4",
              "rank": 56,
              "active": false,
              "_id": "H9AgZBv5N5jvYKXl"
            },
            {
              "name": "a330.mp4",
              "path": "/home/user/medias/a330.mp4",
              "rank": 57,
              "active": false,
              "_id": "R8d57IrBS3pZqAa4"
            },
            {
              "name": "stapler.mp4",
              "path": "/home/user/medias/stapler.mp4",
              "rank": 57,
              "active": false,
              "_id": "NkoZe8Gxu8CeNPsy"
            },
            {
              "name": "astek.mp4",
              "path": "/home/user/medias/astek.mp4",
              "rank": 58,
              "active": false,
              "_id": "TQszt3WnW2U8EW8f"
            },
            {
              "name": "trilobite_eevee.mp4",
              "path": "/home/user/medias/trilobite_eevee.mp4",
              "rank": 58,
              "active": false,
              "_id": "PJ6W1b13oDe9F2i5"
            },
            {
              "name": "trilobite_eevee2.mp4",
              "path": "/home/user/medias/trilobite_eevee2.mp4",
              "rank": 59,
              "active": false,
              "_id": "mXMxum6Ysusja5Bp"
            },
            {
              "name": "trilobite_mediation.mp4",
              "path": "/home/user/medias/trilobite_mediation.mp4",
              "rank": 60,
              "active": false,
              "_id": "HNnQgYRY2GQnlmLL"
            },
            {
              "name": "trilobite_mediationv2.mp4",
              "path": "/home/user/medias/trilobite_mediationv2.mp4",
              "rank": 61,
              "active": false,
              "_id": "6H5ehwOxTUmo554G"
            },
            {
              "name": "trelon_eevee.mp4",
              "path": "/home/user/medias/trelon_eevee.mp4",
              "rank": 62,
              "active": true,
              "_id": "T7ukW9B3TPQhyG5K",
            }
          ]

        return (
            <div className="product">
                <Playlist items={items} url="192.168.1.101"/>
            </div>
        )
    }
}

Product.propTypes = {
    product: PropTypes.object
}