<?php
/*
 *
 Template Name: default
 */
if (!is_user_logged_in()) 
{
	 wp_redirect(get_site_url().'/my-account');
	 exit;
} 
global $woocommerce;

$pargs = array(
        'ex_tax_label'       => false,
        'currency'           => '',
        'decimal_separator'  => wc_get_price_decimal_separator(),
        'thousand_separator' => wc_get_price_thousand_separator(),
        'decimals'           => wc_get_price_decimals(),
        'price_format'       => get_woocommerce_price_format(),
      );

$items = $woocommerce->cart->get_cart();
if (empty($items)) {
	wp_redirect(get_permalink( wc_get_page_id('shop')));
	exit;
} 
get_header();
apply_filters( 'woocommerce_show_page_title', false );
?>
<div class="gift_product_container">
<div id="primary" class="content-area">
    <main id="main" class="site-main giftproduct" role="main">
    	<h1>Gift Product</h1>
        <span class="admin-url" hidden><?php echo $admin_url = admin_url('admin-ajax.php');?></span>
        <span class="checkout-url" hidden><?php echo $woocommerce->cart->get_checkout_url();?></span>
        <span class="giftwrap_charge" hidden><?php echo $giftwrap_charge = get_option('giftproduct_charge', 1); ?></span>
    	<div class="item"></div>
        <div class="col-md-6">
         	<ul class="cart_products">
            <?php
				$items = $woocommerce->cart->get_cart();				
				global $wpdb;
				require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
				$user = wp_get_current_user();
				$user_id = $user->ID;
				$table_name = $wpdb->prefix . "woocommerce_gift_checkout_details";
				$table_name1 = $wpdb->prefix . "woocommerce_gift_product";
				$result     = $wpdb->get_results("SELECT * FROM $table_name where user_id = '$user_id' AND order_id = ''");
				foreach ($result as $group) 
				{
					$group_id_data[] = $group->group_id;										
				}					
				foreach ($items as $item => $values) 
				{
					if($values['variation_id'] != 0){
						$product = wc_get_product($values['variation_id']);
					}
					else{
						$product = wc_get_product($values['product_id']);
					}
				    $product_data = $product->get_data();
				   	$product_id = $values['product_id'].'_'.$values['variation_id'];
				    $qty = 0;
				    if($group_id_data != ''){
				    	foreach ($group_id_data as $group => $group_id) 
						{
							$result_product= $wpdb->get_results("SELECT * FROM $table_name1 WHERE product_id = '$product_id' AND group_id = '$group_id'");							
							$qty = $qty + $result_product[0]->qty;
						}
				    }				    
			?>            	
            	<li class="item_list">	               
	                <input type="checkbox" name="productselectbox" class="productselectbox" id="<?php echo $values['product_id'].'_'.$values['variation_id'];?>" <?php if ($qty >= $values['quantity']){ echo 'disabled="disabled" checked'; }?> />
	                <input type="hidden" name="product_id" class="product_id" value="<?php echo $values['product_id'].'_'.$values['variation_id'];?>" />	
	                	<img src="<?php echo get_the_post_thumbnail_url($product->get_id(), 'full');?>" width="50" height="50" class="prod_img" />			    
					    <span class="cart_item_data product"><?php  echo $product_data['name']; ?></span>
					    <span class="cart_item_data qty"><?php echo $values['quantity'] - $qty;?></span>
					    <span class="cart_item_data" style="width: 35%;text-align: center;"><?php echo wc_price($values['line_subtotal'],$pargs); ?>
					    </span>
				</li>
			<?php
				}
			?>
				<li class="cart_total">
				<?php echo WC()->cart->get_cart_total(); ?>
				</li>
			</ul>
			<div class="action_group">
				<div class="make_group">
					<a href="javascript:void(0);" onClick="make_group()" class="action primary make_group_button"> Make Group </a>
				</div>
			</div>
			 <div class="add_product_position_fix" style="display: none;">
				<div class="product_add_container">
					<span class="add_in_group">
						<img width="50" height="50" src="<?php echo esc_url( plugins_url( '../images/add_product.png', __FILE__ ) )?>"></img>
					</span>
				</div>
			</div> 
			<div class="create_group_container">
			    <div class="group_create">
			    	<h1> Group </h1>
			    	<div class="group_product_list_container">
			    		<div class='gift_product_group'>
							<ul class='gift_product_group_list'>
								<?php
									$result = $wpdb->get_results("SELECT * FROM $table_name where user_id = '$user_id' AND order_id = ''");									
									foreach ($result as $group) {
									    if($i == ''){
									    	 $i = 1;
									    }
								?>
								<li class="gift_product_list_row">
									<a href="#<?php echo $group->group_id; ?>">
										<h4 hidden><?php  echo $group->group_id; ?></h4>
										<h3 class="group_count">Group No <span class="number"><?php echo $i; ?></span></h3>
										
									</a>
									<input type="hidden" class="final_delivery_address" value="<?php echo $group->delivery_add;?>">
									<input type="hidden" class="final_postcode" value="<?php echo $group->postcode; ?>">
									<input type="hidden" class="final_email_address" value="<?php echo $group->email; ?>">
									<input type="hidden" class="final_phone_number" value="<?php echo $group->phone; ?>">
									<span class="group_contain">
										<input type="checkbox" name="gift-wrap" class="gift-wrap" style="display:none" <?php if($group->gift_wrap == 1){ echo 'checked="checked"'; } ?>>
										<span class="gift_wrap tooltip <?php if($group->gift_wrap == 1){ echo 'active'; } ?>">
											<i class="fa fa-gift" aria-hidden="true" style="font-size:25px">	
											</i> 
											<span class="tooltiptext">If Enable it than wrap charges will apply to your product.</span>
										</span>
										<input type="checkbox" name="notify-customer" class="notify-customer" style="display:none" <?php if($group->notify == 1){ echo 'checked="checked"'; } ?>>
										<span class="notify_customer tooltip <?php if($group->notify == 1){ echo 'active'; } ?>">
											<i class="fa fa-bell" aria-hidden="true" style="font-size:25px">
												
											</i> 
											<span class="tooltiptext">If Enable it than Order detail information will sent to the customer.</span>
										</span> 
										<span class="address tooltip ">
											<i class="fa fa-address-card" aria-hidden="true" style="font-size:25px"></i>
											<span class="tooltiptext">Add Delivery Address and information of customer that received
											</span>
										</span> 
										<span class="edit tooltip">
											<i class="fa fa-edit" style="font-size:25px"></i> 
											<span class="tooltiptext">Edit Group products</span>
										</span>
										<span class="close tooltip">
											<i class="fa fa-window-close" style="font-size:25px"></i> 
											<span class="tooltiptext">This will remove Group</span>
										</span> 
									</span>
								</li>
								<?php
								$i++;
									}
								?>
							</ul>
						</div>
						<?php 
						if($giftwrap_charge != 0)
						{
							?>
							<div class="wrap_charge"><i class="fa fa-gift"></i>Gift Wrap Charges : <?php echo get_woocommerce_currency_symbol();?><span class="price"></span>
							</div>
							<?php
						} 
						?>
						<br>
						<button class="gift_product_checkout" style="float: right;">Checkout</button>
						<br>
						
			    	</div>
				</div>
			</div>

		</div>
		<div class="col-md-6">
			<div class="group_name_products">
				
				<?php
					$result = $wpdb->get_results("SELECT * FROM $table_name where user_id = '$user_id' AND order_id = ''");
					$i = 1;
					foreach ($result as $group) 
					{
					    $group->group_id;
					    $products   = $wpdb->get_results("SELECT * FROM $table_name1 where group_id = '$group->group_id'");
					    if (count($products) != 0) {
				?>
				<div class="group_item_list_container active" id="<?php echo $group->group_id; ?>" style="top: 25px; display: none;">
					<h3 class="group_no">Group No <?php echo $i; ?></h3>
					<h2 hidden><?php echo $group->group_id; ?></h2>
					<i class="fa fa-close action group_remove"></i>
					<?php
						foreach ($products as $product) 
						{
							$product_id = explode('_', $product->product_id);
							if($product_id[1] == 0){
								$product_id = $product_id[0];
							}
							else{
								$product_id = $product_id[1];
							}
							 $product_id;
							$product_data = wc_get_product($product_id);
							//var_dump($product_data);
							$product_info = $product_data->get_data();
					?>
					<div class="group_item_list">
						<div class="cart_item_img"><img src="<?php echo get_the_post_thumbnail_url($product_data->get_id(), 'full');?>" width="50" height="50" class="prod_img" /></div>
						<div class="cart_item_name"><?php echo $product_info['name']; ?></div>
					    <input type="hidden" class="group_item_list_id" value="<?php echo $product->product_id; ?>">
					    <div class="qty-btn-function">
					    	<div class="dec button">-</div>
					    </div>
					    <?php 
							$items = $woocommerce->cart->get_cart();
							foreach ($items as $item => $values) 
							{
							     $product_id = $values['product_id'];
							    if($product_id == $product->product_id){
							    	$cart_qty = $values['quantity'];
							    }
							    $qty = 0;
							    foreach ($result as $group) 
								{
								    $result_product= $wpdb->get_results("SELECT * FROM $table_name1 WHERE product_id = '$product->product_id' AND group_id = '$group->group_id'");							
									 $qty = $qty + $result_product[0]->qty;									
								}							 
							}
					    ?>
					    <input  type="hidden" value="<?php echo $cart_qty - $qty + $product->qty; ?>" class="group_item_cart_qty">
					    <input type="number" class="group_item_list_qty" value="<?php echo $product->qty; ?>" min="1" max="<?php echo $cart_qty - $qty + $product->qty; ?>" readonly="">
					    <div class="qty-btn-function">
					    	<div class="inc button">+</div>
					    </div>
					    <div class="delete_item"> 
					    	<i class="fa fa-trash" aria-hidden="true"></i>
					    </div>
					</div>
					<?php } ?>
					<div class="group_action"> 
						<a href="javascript:void(0);" onclick="save_group()" class="action primary save_group_button"> Save </a> 
					</div>
				</div>
				<?php
				    }
				    $i++;
				}
				?>
			</div>
			<div class="action_giftproduct" style="display:none">
				<button class="giftproduct_btn" value="Checkout" disable="disable"  name="giftproduct_btn" > Checkout >> </button>
			</div>	

			<button class="save_details" style="float: right;">Save Changes</button>		
		</div>    
    </main><!-- .site-main -->
</div><!-- .content-area -->
</div>
<?php
get_footer();
?>