//AntimageAutoUlt
//Автор vk.com/adamm122



var interval = 0.1
var damage = [0.6,0.85,1.1]
var scepterdamage = [0.6,0.85,1.1]
var manacost = [125,200,275]
var rangeCast = 600
function AmUltiF(){
if ( !AmUlti.checked )
		return
	var Me = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())
	var Ulti = Entities.GetAbility(Me, 3)
	var UltiLvl = Abilities.GetLevel(Ulti)
	if(UltiLvl==0)
		return
	if ( Abilities.GetCooldownTimeRemaining(Ulti) != 0 || Entities.GetMana(Me)<manacost[UltiLvl-1] )
		return
	if (!Entities.HasScepter(Me))
		var UltiDmg = damage[UltiLvl-1]
	else
		var UltiDmg = scepterdamage[UltiLvl-1]
	MyPos = Entities.GetAbsOrigin(Me)
	var HEnts = Game.PlayersHeroEnts()
	for (i in HEnts) {
		ent = HEnts[i]
		cast = true
		if(Entities.HasItemInInventory(ent, 'item_sphere')) {
			var sphere = Game.GetAbilityByName(ent, 'item_sphere')

			if (Abilities.GetCooldownTimeRemaining(sphere)-2 <= 0) continue
		}
		if(ent==Me)
			continue	
		if ( !Entities.IsEnemy(ent) || !Entities.IsAlive(ent) || Entities.GetAllHeroEntities().indexOf(ent)==-1 )
			continue
		entPos = Entities.GetAbsOrigin(ent)
		if (Game.PointDistance(entPos,MyPos) >  rangeCast) {
			cast = false
		}
		var enemymana = Entities.GetMana(ent)
		var enemymaxmana = Entities.GetMaxMana(ent)
		var MagicResist = Entities.GetArmorReductionForDamageType( ent, 2 )*100

		var calcdamge = (enemymaxmana - enemymana)*UltiDmg
		$.Msg(enemymana, enemymaxmana, UltiDmg)

		var clearDamage = calcdamge - calcdamge/100*MagicResist
		
		if (cast){
			var HP = Entities.GetHealth(ent)
			if ( HP <= clearDamage ){
				GameUI.SelectUnit(Me, false);
				Game.CastTarget(Me, Ulti,ent,false)
				$.Msg(HP,'<',clearDamage)
			}
			cast = false
		}
	}
}
var AmUltiOnCheckBoxClick = function(){
	if ( !AmUlti.checked ){
		Game.ScriptLogMsg('Script disabled: AM Ulti', '#ff0000')
		return
	}
	if ( Players.GetPlayerSelectedHero(Game.GetLocalPlayerID()) != 'npc_dota_hero_antimage' ){
		AmUlti.checked = false
		Game.ScriptLogMsg('AM Ulti:Not AM', '#ff0000')
		return
	}
	function f(){ $.Schedule( interval,function(){
		AmUltiF()
		if(AmUlti.checked)
			f()
	})}
	f()
	Game.ScriptLogMsg('Script enabled: AMUlti', '#00ff00')
}
var Temp = $.CreatePanel( "Panel", $('#scripts'), "Antimage" )
Temp.SetPanelEvent( 'onactivate', AmUltiOnCheckBoxClick )
Temp.BLoadLayoutFromString( '<root><styles><include src="s2r://panorama/styles/dotastyles.vcss_c" /><include src="s2r://panorama/styles/magadan.vcss_c" /></styles><Panel><ToggleButton class="CheckBox" id="Antimage" text="Antimage"/></Panel></root>', false, false)  
var AmUlti = $.GetContextPanel().FindChildTraverse( 'Antimage' ).Children()[0]
