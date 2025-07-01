const documentTexts = [
    {
        text: "lNV0lCE\n\nInv. No.: 2O23-1O42B\nDate: 15/O9/2O23\n\nFrom:\nTechPr0 Solutions lnc.\n123 Digit@l Avenue\nSan Fr@ncisco, CA 941O5\n\nTo:\nAcme Corp0ration\n\nItems:\n- Cloud Serv1ces (Q3)     $12,5OO.OO\n- API Calls (1OOk)         $2,45O.OO\n- Support Hours (2O)       $3,OOO.OO\n\nSubtotal:    $17,95O.OO\nTax (8.5%):  $1,525.75\nTotal:       $19,475.75",
        confidence: 0.86,
        language: "en"
    },
    {
        text: "RECE1PT\n\nStore: QuickM@rt Express\nLoc: 789 M@in Street\nDate: O8/1O/2O23  Time: 14:32\n\n1x Org@nic Milk      $4.99\n2x Wh0le Grain Bread  $7.98\n1x Fresh Produce      $12.5O\n3x Energy Drinks      $8.97\n\nSubtot@l:  $34.44\nTax:       $2.84\nT0TAL:     $37.28\n\nCard: ****-****-****-5123\nAuth: 284B7",
        confidence: 0.91,
        language: "en"
    },
    {
        text: "PURCHASE AGREEMENT\n\nRef: SA-2O23/156C\n\nVendor: Aut0motive Parts Plus\n892 lndustrial R0ad\nDetr0it, Ml 482O1\n\nBuyer: CarTech lnt.\n\nParts List:\n- Engine Contr0l Units x 5O\n- Sens0r Arrays x 1OO\n- Diagnostic T00ls x 25\n\nTotal Value: $157,85O.OO\nDelivery: 3O-45 days\nPayment: Net 6O",
        confidence: 0.88,
        language: "en"
    },
    {
        text: "lNVOlCE\n\nBill To:\nGl0bal Logistics Ltd.\n\nFrom:\nShipFast Express\n45 Harbor View\nP0rt1and, OR 972O1\n\n#SHP-2O23-9876\nDate: 22/O9/2O23\n\nServices:\n- Container Transport   $3,45O.OO\n- Customs Clearing      $75O.OO\n- Insurance             $525.OO\n\nAmount Due: $4,725.OO\nDue Date: 22/1O/2O23",
        confidence: 0.84,
        language: "en"
    },
    {
        text: "RECE1PT\nCoffeeBean Haven\n\nOrder #: CB-2O23-1O567\nDate: O7/1O/2O23\nTime: O8:45 AM\n\n2x Caffe L@tte      $8.5O\n1x Croiss@nt       $3.75\n1x Protein Box      $6.99\nAdd Shot Espress0   $O.75\n\nSubtot@l:  $19.99\nTip:       $4.OO\nTotal:     $23.99\n\nPaid via: AppleP@y",
        confidence: 0.89,
        language: "en"
    },
    {
        text: "SERVICE AGREEMENT\n\nContract lD: MSA-2O23-O45D\n\nProvider:\nSecureNet Solutions\n567 Cyber Street\nAustin, TX 787O1\n\nClient:\nFinTech Dynamics LLC\n\nServices:\n1. Network Monit0ring\n2. Threat Detecti0n\n3. lncident Resp0nse\n\nMonthly Fee: $8,5OO.OO\nTerm: 36 months",
        confidence: 0.87,
        language: "en"
    },
    {
        text: "lNV0lCE\n\nMegaBuild Construction\n234 Builder's Row\nChicag0, lL 6O6O1\n\nProject: Skyline Tower\nInv #: CON-2O23-O234\n\nLabor (45O hrs)    $22,5OO.OO\nMaterials          $34,75O.OO\nEquipment Rental   $12,8OO.OO\n\nTotal Due:         $7O,O5O.OO\nTerms: Net 45",
        confidence: 0.85,
        language: "en"
    },
    {
        text: "RECE1PT\nTechMart Electronics\n\nTransaction lD: TM-98765\nDate: O5/1O/2O23\n\n1x Lapt0p Pro X1    $1,299.99\n1x Ext. Warr@nty    $149.99\n1x Carrying C@se    $59.99\n\nSubtot@l:  $1,5O9.97\nTax (9.5%): $143.45\nT0TAL:      $1,653.42\n\nPaid: Credit C@rd",
        confidence: 0.90,
        language: "en"
    },
    {
        text: "LEASE AGREEMENT\n\nProperty: Unit 12B\nSunrise Towers\n789 Ocean Drive\nMi@mi, FL 331O1\n\nLessee: John D0e\nTerm: 12 m0nths\nMonthly Rent: $2,85O.OO\nSecurity Dep: $3,OOO.OO\n\nUtilities lncluded:\n- Water\n- Basic C@ble\n- lnternet",
        confidence: 0.86,
        language: "en"
    },
    {
        text: "lNVOlCE\n\nCreative Design Studio\n456 Artist Lane\nL0s Angeles, CA 9OO28\n\nClient: Fashion Forward lnc.\nProject: Brand Refresh\n\nLogo Design        $3,5OO.OO\nBrand Guidelines   $2,75O.OO\nSocial Media Kit   $1,8OO.OO\n\nTotal:            $8,O5O.OO\nInv #: DES-2O23-O89",
        confidence: 0.88,
        language: "en"
    },
    {
        text: "RECE1PT\nHealthy Harvest Market\n\nDate: O9/1O/2O23\nTime: 16:23\n\n2x Org@nic Quinoa   $12.98\n1x Alm0nd Milk      $4.99\n3x Pr0tein Bars     $8.97\n1x Vitam1n Pack     $24.99\n\nMember Disc0unt:   -$5.OO\nTotal:             $46.93\n\nPaid: Debit ****4321",
        confidence: 0.87,
        language: "en"
    },
    {
        text: "EMPLOYMENT CONTRACT\n\nBetween:\nDataTech Solutions\n&\nJane Sm1th\n\nPosition: Sr. Devel0per\nStart Date: O1/11/2O23\n\nCompensation:\nBase: $12O,OOO p.a.\nBonus: up to 2O%\nStock Opti0ns: 1,OOO\n\nBenefits:\n- Health lnsurance\n- 4O1k Match\n- Remote W0rk",
        confidence: 0.89,
        language: "en"
    }
];

export function simulateOCR(): Promise<{ text: string, confidence: number, language: string }> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const randomDocumentOCR = documentTexts[Math.floor(Math.random() * documentTexts.length)];
            resolve({
                ...randomDocumentOCR,
            });
        }, 1000);
    });
}